import { formatPartOfSpeech } from "@/utils/part-of-speech";
import { globalStyles } from "@/utils/tailwind";
import { Text, View } from "react-native";

export function PartOfSpeechBadge({ label }: { label: string }) {
  return (
    <View style={globalStyles.posPill}>
      <Text style={globalStyles.posPillText}>{formatPartOfSpeech(label)}</Text>
    </View>
  );
}

export function SectionDivider() {
  return (
    <View style={globalStyles.sectionRule}>
      <View style={globalStyles.sectionRuleLine} />
      <Text style={globalStyles.sectionRuleSymbol}>◆</Text>
      <View style={globalStyles.sectionRuleLine} />
    </View>
  );
}
