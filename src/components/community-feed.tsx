"use client";

import { useState } from "react";
import { Heart, MessageCircle, Send, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFeed, useAddAmen, useAddComment } from "@/hooks/use-rosary";
import { CheckIn, getMysteryInfo, INTENTION_TAGS } from "@/types";
import { formatRelativeTime, getInitials, cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function CommunityFeed({ limit }: { limit?: number }) {
  const t = useTranslations("CommunityFeed");
  const { data, isLoading, error } = useFeed();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 rounded-[2rem] bg-muted/20 animate-pulse border border-primary/10" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive font-bold">{t("error")}</p>
      </div>
    );
  }

  const checkIns = limit ? data?.checkIns.slice(0, limit) : data?.checkIns;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {checkIns?.map((checkIn, index) => (
          <FeedCard key={checkIn.id} checkIn={checkIn} index={index} />
        ))}
      </div>

      {checkIns?.length === 0 && (
        <div className="text-center py-20 px-4 bg-muted/10 rounded-[3rem] border border-dashed border-primary/20">
          <div className="text-6xl mb-6 animate-float">🕊️</div>
          <p className="text-muted-foreground font-manrope font-medium">
            {t("empty")}
          </p>
        </div>
      )}
    </div>
  );
}

function FeedCard({ checkIn, index }: { checkIn: CheckIn; index: number }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const t = useTranslations("CommunityFeed");
  
  const amenMutation = useAddAmen();
  const commentMutation = useAddComment();

  const mysteryInfo = getMysteryInfo(checkIn.mystery);
  const intentionLabels = checkIn.intentions.map(
    (tag) => INTENTION_TAGS.find((t) => t.value === tag)
  );

  const handleAmen = () => {
    amenMutation.mutate({ checkInId: checkIn.id });
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    
    commentMutation.mutate(
      { checkInId: checkIn.id, content: newComment.trim() },
      { onSuccess: () => setNewComment("") }
    );
  };

  return (
    <div 
      className={`glass-card p-6 sm:p-8 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-gold-glow border-primary/10 ${index % 2 === 1 ? 'md:mt-8' : ''}`}
      data-magic-bento
    >
      <div>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 flex-shrink-0">
              {checkIn.user.avatarUrl ? (
                <img
                  src={checkIn.user.avatarUrl}
                  alt={checkIn.user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-primary font-bold text-xs">
                  {getInitials(checkIn.user.name)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-foreground truncate uppercase tracking-widest">
                {checkIn.user.name}
              </h3>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                {t("prayedThe")} {mysteryInfo.name}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
            {formatRelativeTime(checkIn.createdAt)}
          </span>
        </div>

        {/* Reflection */}
        {checkIn.reflection && (
          <p className="text-foreground/90 mb-6 italic leading-relaxed font-manrope font-medium text-sm border-l-2 border-primary/20 pl-4 py-1">
            "{checkIn.reflection}"
          </p>
        )}

        {/* Intention tags */}
        {intentionLabels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {intentionLabels.map(
              (tag) =>
                tag && (
                  <span
                    key={tag.value}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest rounded-full border border-primary/10"
                  >
                    <span>{tag.emoji}</span>
                    <span>{tag.label}</span>
                  </span>
                )
            )}
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleAmen}
              disabled={amenMutation.isPending}
              className={cn(
                "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                checkIn.hasUserAmened ? "text-rose-500" : "text-muted-foreground hover:text-primary"
              )}
            >
              <Heart
                className={cn("w-4 h-4 transition-transform active:scale-125", checkIn.hasUserAmened && "fill-current")}
              />
              <span>{checkIn.amens} {t("amen")}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{checkIn.comments.length}</span>
            </button>
          </div>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="space-y-4 pt-6 mt-6 border-t border-primary/5">
            {checkIn.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/5">
                  <User className="w-4 h-4 text-primary/60" />
                </div>
                <div className="flex-1 bg-muted/30 rounded-2xl px-4 py-3 border border-primary/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">
                      {comment.user.name}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-medium">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}

            <div className="flex gap-2 mt-4">
              <input
                placeholder={t("commentPlaceholder")}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
                className="flex-1 bg-background border border-primary/10 rounded-full px-4 py-2 text-xs focus:outline-none focus:border-primary/40 transition-all font-medium"
              />
              <Button
                size="icon"
                className="w-8 h-8 rounded-full bg-primary text-primary-foreground shadow-sm"
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || commentMutation.isPending}
              >
                {commentMutation.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Send className="w-3 h-3" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
