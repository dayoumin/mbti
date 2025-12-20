'use client';

import React, { useState } from 'react';
import { MessageCircle, Heart, Share2, Search, Filter, Plus, ChevronRight } from 'lucide-react';
import CommentSystem from './CommentSystem';
import { MOCK_COMMUNITY_POSTS, CATEGORY_LABELS, getCategoryLabel, getCategoryStyle, type PostCategory } from '@/data/content/community';

type CategoryKey = 'all' | PostCategory;

export default function CommunityBoard({ className = '' }: { className?: string }) {
    const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    const filteredPosts = activeCategory === 'all'
        ? MOCK_COMMUNITY_POSTS
        : MOCK_COMMUNITY_POSTS.filter(p => p.category === activeCategory);

    const selectedPost = MOCK_COMMUNITY_POSTS.find(p => p.id === selectedPostId);

    if (selectedPostId && selectedPost) {
        return (
            <div className={`flex flex-col h-full bg-white animate-fade-in ${className}`}>
                {/* Post Detail Header */}
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 flex items-center justify-between">
                    <button onClick={() => setSelectedPostId(null)} className="text-slate-500 font-bold flex items-center gap-1">
                        <ChevronRight className="w-5 h-5 rotate-180" /> 목록으로
                    </button>
                    <div className="flex gap-3">
                        <button className="p-2 text-slate-400 hover:text-rose-500"><Heart className="w-5 h-5" /></button>
                        <button className="p-2 text-slate-400 hover:text-indigo-500"><Share2 className="w-5 h-5" /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full mb-2 inline-block ${getCategoryStyle(selectedPost.category)}`}>
                            {getCategoryLabel(selectedPost.category)}
                        </span>
                        <h1 className="text-xl font-black text-slate-800 leading-tight mb-3">
                            {selectedPost.title}
                        </h1>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="font-bold text-slate-600">{selectedPost.author}</span>
                            <span>·</span>
                            <span>{selectedPost.date}</span>
                            <span>·</span>
                            <span>조회 {selectedPost.viewCount}</span>
                        </div>
                    </div>

                    <div className="text-slate-700 leading-relaxed text-sm mb-8 whitespace-pre-wrap">
                        {selectedPost.content}
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                        <CommentSystem targetType="test_result" targetId={`post_${selectedPostId}`} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-full bg-slate-50 relative ${className}`}>
            {/* Search & Header */}
            <div className="bg-white px-6 py-4 shadow-sm border-b border-slate-100 sticky top-0 z-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black text-slate-800">커뮤니티</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                            type="text"
                            placeholder="검색어를 입력하세요"
                            className="bg-slate-50 border-none rounded-full py-2 pl-9 pr-4 text-xs w-48 focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setActiveCategory(key as CategoryKey)}
                            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${activeCategory === key
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Post List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
                {filteredPosts.map(post => (
                    <button
                        key={post.id}
                        onClick={() => setSelectedPostId(post.id)}
                        className="w-full bg-white p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all text-left flex flex-col gap-2 group"
                    >
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getCategoryStyle(post.category)}`}>
                                {getCategoryLabel(post.category)}
                            </span>
                            <span className="text-[10px] text-slate-400">{post.date}</span>
                        </div>
                        <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-sm truncate">
                            {post.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {post.content}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                <Heart className="w-3 h-3" /> {post.likes}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                <MessageCircle className="w-3 h-3" /> {post.comments}
                            </div>
                            <span className="ml-auto text-[10px] text-slate-300 font-medium">조회 {post.viewCount}</span>
                        </div>
                    </button>
                ))}

                {filteredPosts.length === 0 && (
                    <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
                        <Filter className="w-8 h-8 opacity-20" />
                        <p className="text-sm font-medium">게시글이 없습니다</p>
                    </div>
                )}
            </div>

            {/* Write Button */}
            <button className="fixed bottom-24 right-6 w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-300 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-20">
                <Plus className="w-6 h-6" />
            </button>
        </div>
    );
}
