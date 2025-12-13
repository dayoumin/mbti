/**
 * InsightService - 여러 테스트 결과를 종합하여 인사이트 생성
 *
 * 기능:
 * - 완료한 테스트들의 결과 분석
 * - 테스트 간 상관관계 계산 (Human ↔ Animal, Human ↔ IdealType)
 * - 종합 성격 프로필 생성
 * - 통합 인사이트 메시지 생성
 */

(function(window) {
    'use strict';

    // ========== 상수 정의 ==========

    // 인사이트 생성 조건
    const INSIGHT_REQUIREMENTS = {
        // 최소 요구사항
        minimum: {
            testsCompleted: 1
        },

        // 기본 인사이트 (성격 프로필)
        basic: {
            required: ['human'],
            provides: ['personalityProfile']
        },

        // 동물 인사이트
        animal: {
            required: ['human'],
            optional: ['cat', 'dog', 'rabbit', 'hamster'],
            provides: ['animalProfile', 'petCompatibility']
        },

        // 관계 인사이트
        relationship: {
            required: ['human', 'idealType'],
            provides: ['relationshipProfile']
        },

        // 라이프스타일 인사이트
        lifestyle: {
            required: [],
            optional: ['plant', 'coffee', 'petMatch'],
            provides: ['lifestyleProfile']
        },

        // 완전한 통합 인사이트
        full: {
            required: ['human', 'cat', 'dog', 'idealType'],
            optional: ['plant', 'coffee', 'petMatch'],
            provides: ['summaryMessages', 'crossTestPatterns']
        }
    };

    // 차원 간 상관관계 매핑
    const DIMENSION_CORRELATIONS = {
        // Human ↔ Cat 상관관계
        human_cat: {
            'inssa': { 'cute': 0.7, 'boss': -0.3 },
            'adventure': { 'curious': 0.8, 'alert': 0.4 },
            'empathy': { 'cute': 0.5, 'random': -0.2 },
            'plan': { 'alert': 0.3, 'random': -0.6 },
            'mental': { 'boss': 0.5, 'alert': 0.4 }
        },

        // Human ↔ Dog 상관관계
        human_dog: {
            'inssa': { 'humanLove': 0.8, 'dogFriend': 0.7 },
            'adventure': { 'energy': 0.9, 'brave': 0.6 },
            'empathy': { 'humanLove': 0.6, 'focus': 0.3 },
            'plan': { 'focus': 0.7, 'persist': 0.5 },
            'mental': { 'brave': 0.7, 'persist': 0.6 }
        },

        // Human ↔ Rabbit 상관관계
        human_rabbit: {
            'inssa': { 'social': 0.8, 'active': 0.5 },
            'adventure': { 'curious': 0.7, 'brave': 0.6 },
            'empathy': { 'social': 0.5, 'chill': 0.4 },
            'plan': { 'chill': -0.3 },
            'mental': { 'brave': 0.6 }
        },

        // Human ↔ Hamster 상관관계
        human_hamster: {
            'inssa': { 'tame': 0.6 },
            'adventure': { 'curious': 0.8, 'active': 0.7 },
            'empathy': { 'tame': 0.5 },
            'plan': { 'hoard': 0.6 },
            'mental': { 'nocturnal': 0.3 }
        },

        // Human ↔ IdealType 상관관계
        human_idealType: {
            'inssa': { 'express': 0.7, 'active': 0.6 },
            'adventure': { 'passion': 0.5, 'active': 0.8 },
            'empathy': { 'commit': 0.6, 'close': 0.7 },
            'plan': { 'commit': 0.8 },
            'mental': { 'passion': 0.4 }
        }
    };

    // 특성 설명
    const TRAIT_DESCRIPTIONS = {
        inssa: { name: '인싸력', desc: '사교적이고 에너지 넘치는' },
        adventure: { name: '모험심', desc: '새로운 도전을 즐기는' },
        empathy: { name: '공감력', desc: '다른 사람의 마음을 잘 읽는' },
        plan: { name: '계획력', desc: '체계적으로 준비하는' },
        mental: { name: '멘탈력', desc: '흔들리지 않는 단단한' }
    };

    // ========== InsightService 클래스 ==========

    class InsightService {
        constructor() {
            this.correlations = DIMENSION_CORRELATIONS;
            this.requirements = INSIGHT_REQUIREMENTS;

            // 상수 참조 (방어 코드 포함)
            this.MAX_SCORE = window.CHEMI_CONSTANTS?.MAX_SCORE_PER_QUESTION ?? 5;
            this.DEFAULT_QUESTION_COUNT = window.CHEMI_CONSTANTS?.DEFAULT_QUESTION_COUNT ?? 5;

            // 총 테스트 수
            this.TOTAL_TESTS = 9;
        }

        // ========== 유틸리티 메서드 ==========

        // 결과를 테스트 타입별로 그룹화
        groupByType(results) {
            return results.reduce((acc, result) => {
                const type = result.testType;
                if (!acc[type]) acc[type] = [];
                acc[type].push(result);
                return acc;
            }, {});
        }

        // 가장 최근 결과 가져오기
        getLatestResult(results) {
            if (!results || results.length === 0) return null;
            return results.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            )[0];
        }

        // 점수 정규화 (0-1 범위)
        normalizeScore(score, questionCount) {
            const maxScore = (questionCount || this.DEFAULT_QUESTION_COUNT) * this.MAX_SCORE;
            return Math.min(1, Math.max(0, score / maxScore));
        }

        // ========== 인사이트 생성 메서드 ==========

        // 통합 인사이트 생성 (메인 메서드)
        async generateInsights() {
            let results;
            try {
                results = await window.resultService.getMyResults();
            } catch (error) {
                console.error('[InsightService] 결과 조회 실패:', error);
                return {
                    hasData: false,
                    message: '결과를 불러오는 데 실패했어요.'
                };
            }

            if (!results || results.length === 0) {
                return {
                    hasData: false,
                    message: '아직 완료한 테스트가 없어요!'
                };
            }

            const resultsByType = this.groupByType(results);
            const completedTests = Object.keys(resultsByType);

            const insights = {
                hasData: true,
                completedTests,
                completionRate: completedTests.length / this.TOTAL_TESTS,
                totalTestsTaken: results.length,

                // 각 인사이트 영역
                personalityProfile: null,
                animalCompatibility: null,
                relationshipProfile: null,
                lifestyleProfile: null,

                // 종합 메시지
                summaryMessages: [],
                recommendations: []
            };

            // 1. 성격 프로필 (human 테스트 필요)
            if (resultsByType.human) {
                insights.personalityProfile = this.analyzePersonality(
                    this.getLatestResult(resultsByType.human)
                );
            }

            // 2. 동물 호환성 (human + 동물 테스트)
            if (resultsByType.human) {
                const animalTypes = ['cat', 'dog', 'rabbit', 'hamster'];
                const completedAnimals = animalTypes.filter(t => resultsByType[t]);

                if (completedAnimals.length > 0) {
                    insights.animalCompatibility = this.analyzeAnimalCompatibility(
                        this.getLatestResult(resultsByType.human),
                        completedAnimals.map(t => ({
                            type: t,
                            result: this.getLatestResult(resultsByType[t])
                        }))
                    );
                }
            }

            // 3. 관계 프로필 (human + idealType)
            if (resultsByType.human && resultsByType.idealType) {
                insights.relationshipProfile = this.analyzeRelationship(
                    this.getLatestResult(resultsByType.idealType),
                    this.getLatestResult(resultsByType.human)
                );
            }

            // 4. 라이프스타일 프로필
            const lifestyleTypes = ['plant', 'coffee', 'petMatch'];
            const completedLifestyle = lifestyleTypes.filter(t => resultsByType[t]);

            if (completedLifestyle.length > 0) {
                insights.lifestyleProfile = this.analyzeLifestyle(
                    completedLifestyle.map(t => ({
                        type: t,
                        result: this.getLatestResult(resultsByType[t])
                    }))
                );
            }

            // 5. 종합 메시지 생성
            insights.summaryMessages = this.generateSummaryMessages(insights);

            // 6. 추천 테스트
            insights.recommendations = this.getRecommendations(completedTests);

            return insights;
        }

        // 성격 프로필 분석
        analyzePersonality(humanResult) {
            if (!humanResult || !humanResult.scores) return null;

            const scores = humanResult.scores;
            const dims = Object.entries(scores)
                .map(([dim, score]) => ({
                    dimension: dim,
                    score,
                    normalized: this.normalizeScore(score, this.DEFAULT_QUESTION_COUNT),
                    ...TRAIT_DESCRIPTIONS[dim]
                }))
                .sort((a, b) => b.score - a.score);

            // 지배적 특성 (상위 2개)
            const dominantTraits = dims.slice(0, 2);

            // 발전 가능 영역 (하위 2개)
            const growthAreas = dims.slice(-2).reverse();

            return {
                resultName: humanResult.resultKey,
                resultEmoji: humanResult.resultEmoji,
                dimensions: dims,
                dominantTraits,
                growthAreas,
                summary: this.generatePersonalitySummary(dominantTraits)
            };
        }

        // 성격 요약 생성
        generatePersonalitySummary(dominantTraits) {
            if (!dominantTraits || dominantTraits.length === 0) return '';

            const trait1 = dominantTraits[0];
            const trait2 = dominantTraits[1];

            if (trait2) {
                return `${trait1.desc} 성격에 ${trait2.desc} 면도 가지고 있어요.`;
            }
            return `${trait1.desc} 성격이에요.`;
        }

        // 동물 호환성 분석
        analyzeAnimalCompatibility(humanResult, animalResults) {
            if (!humanResult || !animalResults || animalResults.length === 0) return null;

            const humanScores = humanResult.scores;
            const compatibility = [];

            for (const animal of animalResults) {
                const correlationKey = `human_${animal.type}`;
                const correlation = this.correlations[correlationKey];

                if (!correlation || !animal.result) continue;

                const similarity = this.calculateSimilarity(
                    humanScores,
                    animal.result.scores,
                    correlation
                );

                const config = window.SUBJECT_CONFIG?.[animal.type];

                compatibility.push({
                    type: animal.type,
                    name: config?.title || animal.type,
                    emoji: animal.result.resultEmoji,
                    resultName: animal.result.resultKey,
                    similarity: Math.round(similarity * 100),
                    matchLevel: this.getSimilarityLevel(similarity),
                    insight: this.generateAnimalInsight(animal.type, similarity, humanScores)
                });
            }

            // 유사도 높은 순 정렬
            compatibility.sort((a, b) => b.similarity - a.similarity);

            return {
                animals: compatibility,
                bestMatch: compatibility[0] || null,
                summary: this.generateAnimalSummary(compatibility)
            };
        }

        // 상관관계 기반 유사도 계산
        calculateSimilarity(humanScores, animalScores, correlation) {
            let totalCorrelation = 0;
            let count = 0;

            const maxScorePerDimension = this.DEFAULT_QUESTION_COUNT * this.MAX_SCORE;

            for (const [humanDim, animalCorr] of Object.entries(correlation)) {
                const humanScore = humanScores[humanDim] || 0;

                for (const [animalDim, corrValue] of Object.entries(animalCorr)) {
                    const animalScore = animalScores[animalDim] || 0;

                    const normalizedHuman = humanScore / maxScorePerDimension;
                    const normalizedAnimal = animalScore / maxScorePerDimension;

                    if (corrValue > 0) {
                        // 양의 상관: 둘 다 높거나 낮으면 유사
                        totalCorrelation += (1 - Math.abs(normalizedHuman - normalizedAnimal)) * corrValue;
                    } else {
                        // 음의 상관: 반대면 유사
                        totalCorrelation += Math.abs(normalizedHuman - normalizedAnimal) * Math.abs(corrValue);
                    }
                    count++;
                }
            }

            return count > 0 ? Math.min(1, Math.max(0, totalCorrelation / count + 0.3)) : 0.5;
        }

        // 유사도 레벨
        getSimilarityLevel(similarity) {
            if (similarity >= 0.8) return { level: 'high', label: '찰떡궁합', color: 'text-green-500' };
            if (similarity >= 0.6) return { level: 'medium', label: '잘 맞아요', color: 'text-blue-500' };
            if (similarity >= 0.4) return { level: 'low', label: '보통이에요', color: 'text-yellow-500' };
            return { level: 'mismatch', label: '다른 매력', color: 'text-gray-500' };
        }

        // 동물별 인사이트 생성
        generateAnimalInsight(animalType, similarity, humanScores) {
            const insights = {
                cat: {
                    high: '고양이의 독립적인 매력과 잘 통해요!',
                    medium: '고양이와 적당한 거리감을 유지할 수 있어요.',
                    low: '고양이의 변덕이 조금 당황스러울 수 있어요.'
                },
                dog: {
                    high: '강아지의 충성심과 에너지가 잘 맞아요!',
                    medium: '강아지와 함께하면 활력을 얻을 수 있어요.',
                    low: '강아지의 에너지가 조금 부담될 수 있어요.'
                },
                rabbit: {
                    high: '토끼의 순한 성격과 잘 어울려요!',
                    medium: '토끼와 조용한 시간을 보내기 좋아요.',
                    low: '토끼는 조금 심심할 수 있어요.'
                },
                hamster: {
                    high: '햄스터의 귀여움에 푹 빠질 거예요!',
                    medium: '햄스터와 관찰하는 재미가 있어요.',
                    low: '햄스터의 야행성이 맞지 않을 수 있어요.'
                }
            };

            const level = similarity >= 0.7 ? 'high' : similarity >= 0.5 ? 'medium' : 'low';
            return insights[animalType]?.[level] || '독특한 케미가 있어요!';
        }

        // 동물 호환성 요약
        generateAnimalSummary(compatibility) {
            if (!compatibility || compatibility.length === 0) return '';

            const best = compatibility[0];
            if (!best) return '';

            return `${best.name}와 ${best.similarity}% 케미!`;
        }

        // 관계 분석 (idealType + human)
        analyzeRelationship(idealTypeResult, humanResult) {
            if (!idealTypeResult || !idealTypeResult.scores) return null;

            const idealScores = idealTypeResult.scores;

            // 가장 높은 차원 찾기 (사랑의 언어)
            const dims = Object.entries(idealScores).sort((a, b) => b[1] - a[1]);
            const primaryLanguage = dims[0]?.[0];
            const secondaryLanguage = dims[1]?.[0];

            // 연애 스타일 키워드
            const languageNames = {
                passion: '열정',
                commit: '헌신',
                close: '친밀감',
                express: '표현',
                active: '활동'
            };

            // 호환 타입 추론
            const compatibleTypes = [];
            if (idealScores.passion > 15) compatibleTypes.push('열정적인 파트너');
            if (idealScores.commit > 15) compatibleTypes.push('진지한 관계');
            if (idealScores.close > 15) compatibleTypes.push('다정한 연인');
            if (idealScores.express > 15) compatibleTypes.push('표현력 좋은 사람');
            if (idealScores.active > 15) compatibleTypes.push('활동적인 데이트');

            return {
                resultName: idealTypeResult.resultKey,
                resultEmoji: idealTypeResult.resultEmoji,
                primaryLanguage: {
                    key: primaryLanguage,
                    name: languageNames[primaryLanguage] || primaryLanguage
                },
                secondaryLanguage: secondaryLanguage ? {
                    key: secondaryLanguage,
                    name: languageNames[secondaryLanguage] || secondaryLanguage
                } : null,
                compatibleTypes: compatibleTypes.length > 0 ? compatibleTypes : ['균형잡힌 관계'],
                summary: this.generateRelationshipSummary(primaryLanguage, languageNames)
            };
        }

        // 관계 요약 생성
        generateRelationshipSummary(primaryLanguage, languageNames) {
            const name = languageNames[primaryLanguage];
            if (!name) return '다양한 매력을 가진 연애 스타일이에요.';

            const summaries = {
                passion: '불꽃 튀는 사랑을 원해요!',
                commit: '진지하고 깊은 관계를 원해요.',
                close: '따뜻하고 가까운 관계가 좋아요.',
                express: '사랑을 말로 표현하는 게 중요해요.',
                active: '함께 뭔가 하는 게 좋아요!'
            };

            return summaries[primaryLanguage] || '독특한 연애 스타일이에요.';
        }

        // 라이프스타일 분석
        analyzeLifestyle(lifestyleResults) {
            if (!lifestyleResults || lifestyleResults.length === 0) return null;

            const profile = {};
            const insights = [];

            for (const item of lifestyleResults) {
                if (!item.result) continue;

                const config = window.SUBJECT_CONFIG?.[item.type];

                profile[item.type] = {
                    resultName: item.result.resultKey,
                    resultEmoji: item.result.resultEmoji,
                    title: config?.title || item.type
                };

                // 타입별 인사이트
                if (item.type === 'coffee') {
                    insights.push(`☕ 커피 취향: ${item.result.resultKey}`);
                } else if (item.type === 'plant') {
                    insights.push(`🌱 반려식물: ${item.result.resultKey}`);
                } else if (item.type === 'petMatch') {
                    insights.push(`🐾 추천 반려동물: ${item.result.resultKey}`);
                }
            }

            return {
                profile,
                insights,
                summary: insights.length > 0 ? insights.join(' / ') : '라이프스타일 테스트를 더 해보세요!'
            };
        }

        // 종합 메시지 생성
        generateSummaryMessages(insights) {
            const messages = [];

            // 성격 기반 메시지
            if (insights.personalityProfile) {
                const dominant = insights.personalityProfile.dominantTraits[0];
                if (dominant) {
                    messages.push({
                        type: 'personality',
                        emoji: '✨',
                        title: '당신의 핵심 성격',
                        content: insights.personalityProfile.summary
                    });
                }
            }

            // 동물 호환성 메시지
            if (insights.animalCompatibility?.bestMatch) {
                const best = insights.animalCompatibility.bestMatch;
                messages.push({
                    type: 'animal',
                    emoji: best.emoji || '🐾',
                    title: '최고의 동물 케미',
                    content: `${best.name}와 ${best.similarity}% 케미! ${best.insight}`
                });
            }

            // 관계 메시지
            if (insights.relationshipProfile) {
                messages.push({
                    type: 'relationship',
                    emoji: '💕',
                    title: '연애 스타일',
                    content: insights.relationshipProfile.summary
                });
            }

            // 라이프스타일 메시지
            if (insights.lifestyleProfile?.insights?.length > 0) {
                messages.push({
                    type: 'lifestyle',
                    emoji: '🌈',
                    title: '라이프스타일',
                    content: insights.lifestyleProfile.summary
                });
            }

            // 완료율 메시지
            const completionPercent = Math.round(insights.completionRate * 100);
            if (completionPercent < 100) {
                messages.push({
                    type: 'progress',
                    emoji: '🎯',
                    title: '테스트 진행률',
                    content: `${completionPercent}% 완료! 더 많은 테스트로 정확한 인사이트를 받아보세요.`
                });
            } else {
                messages.push({
                    type: 'complete',
                    emoji: '🏆',
                    title: '모든 테스트 완료!',
                    content: '축하해요! 모든 케미 테스트를 완료했어요.'
                });
            }

            return messages;
        }

        // 추천 테스트
        getRecommendations(completedTests) {
            const allTests = ['human', 'cat', 'dog', 'rabbit', 'hamster', 'idealType', 'plant', 'coffee', 'petMatch'];
            const incomplete = allTests.filter(t => !completedTests.includes(t));

            if (incomplete.length === 0) return [];

            // 우선순위 기반 추천
            const priority = {
                human: 1,      // 기본 필수
                cat: 2,
                dog: 2,
                idealType: 3,
                rabbit: 4,
                hamster: 4,
                plant: 5,
                coffee: 5,
                petMatch: 5
            };

            const recommendations = incomplete
                .sort((a, b) => priority[a] - priority[b])
                .slice(0, 3)
                .map(testType => {
                    const config = window.SUBJECT_CONFIG?.[testType];
                    const data = window.CHEMI_DATA?.[testType];

                    return {
                        testType,
                        title: data?.title || testType,
                        subtitle: data?.subtitle || '',
                        icon: config?.icon,
                        reason: this.getRecommendationReason(testType, completedTests)
                    };
                });

            return recommendations;
        }

        // 추천 이유
        getRecommendationReason(testType, completedTests) {
            if (testType === 'human' && !completedTests.includes('human')) {
                return '기본 성격 분석을 위해 필수예요!';
            }
            if (['cat', 'dog'].includes(testType) && completedTests.includes('human')) {
                return '성격과 동물 케미를 분석해드려요!';
            }
            if (testType === 'idealType' && completedTests.includes('human')) {
                return '연애 스타일을 알아보세요!';
            }
            return '새로운 인사이트를 발견해보세요!';
        }
    }

    // ========== 전역 노출 ==========

    // 싱글톤 인스턴스
    window.insightService = new InsightService();

    // 클래스와 상수 노출
    window.InsightService = InsightService;
    window.DIMENSION_CORRELATIONS = DIMENSION_CORRELATIONS;
    window.INSIGHT_REQUIREMENTS = INSIGHT_REQUIREMENTS;

})(window);
