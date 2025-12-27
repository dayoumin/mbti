'use client';

import React from 'react';
import { MessageSquare, MessageCircle, Heart, ChevronRight, Hash } from 'lucide-react';
import { MOCK_COMMUNITY_PREVIEW, getPostCategoryLabel } from '@/data/content/community';

export default function TalkPreview({ onClickAll, className = '' }: { onClickAll?: () => void, className?: string }) {
    return (
        <div className={`glass-card rounded-md border border-subtle shadow-sm p-4 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-pink-600" />
                    </div>
                    <h3 className="text-sm font-black text-slate-800">커뮤니티 톡</h3>
                </div>
                <button
                    onClick={onClickAll}
                    className="text-xs font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-0.5 transition-colors"
                >
                    더보기 <ChevronRight className="w-3 h-3" />
                </button>
            </div>

            <div className="space-y-3">
                {MOCK_COMMUNITY_PREVIEW.slice(0, 2).map(post => (
                    <div
                        key={post.id}
                        className="p-3 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors cursor-pointer group"
                    >
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="text-xs font-bold px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded-full border border-slate-100">
                                #{getPostCategoryLabel(post.category)}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">{post.author}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-1 truncate">
                            {post.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1 mb-2">
                            {post.content}
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                                <Heart className="w-3 h-3" /> {post.likes}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                                <MessageCircle className="w-3 h-3" /> {post.comments}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                <Hash className="w-3 h-3" />
                나도 글 남기기
            </button>
        </div>
    );
}
