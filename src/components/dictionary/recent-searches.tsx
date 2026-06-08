import {
  Clock,
  ICON_STROKE,
  Search,
} from "@/components/dictionary/dictionary-icons";
import { Icon } from "@/components/icon";
import { useSearchHistory } from "@/context/search-history-context";
import { cn } from "@/utils/tailwind";
import { useRouter, type Href } from "expo-router";
import { Pressable, Text, View } from "react-native";

export function RecentSearches({ className }: { className?: string }) {
  const { history } = useSearchHistory();
  const router = useRouter();
  const recent = history.slice(0, 6);

  if (recent.length === 0) {
    return (
      <View
        className={cn(
          "mx-5 rounded-2xl border border-border bg-card px-5 py-8 items-center gap-3 shadow-card font-sans",
          className,
        )}
      >
        <View className="w-12 h-12 rounded-full bg-primary-muted items-center justify-center">
          <Icon icon={Search} strokeWidth={ICON_STROKE} className="w-6 h-6 text-primary" />
        </View>
        <Text className="text-[17px] font-medium text-foreground text-center">
          Start exploring words
        </Text>
        <Text className="text-[15px] text-muted-foreground text-center leading-snug">
          Your recent searches will appear here for quick access.
        </Text>
      </View>
    );
  }

  return (
    <View className={cn("px-5 gap-3 font-sans", className)}>
      <View className="flex-row items-center gap-2">
        <Icon icon={Clock} strokeWidth={ICON_STROKE} className="w-4 h-4 text-primary" />
        <Text className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
          Recent searches
        </Text>
      </View>
      <View className="flex-row flex-wrap gap-2">
        {recent.map((item) => (
          <Pressable
            key={item.word}
            onPress={() =>
              router.push(
                `/word/${encodeURIComponent(item.word)}` as Href,
              )
            }
            className="flex-row items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 shadow-card active:bg-primary-muted"
          >
            <Icon icon={Search} strokeWidth={ICON_STROKE} className="w-3.5 h-3.5 text-primary" />
            <Text className="text-[15px] font-medium text-primary">
              {item.word}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
