import * as LucideIcons from "lucide-react";

interface Props extends Omit<LucideIcons.LucideProps, "name"> {
  name: string;
}

export function DynamicIcon({ name, ...props }: Props) {
  // Normalize common aliases
  const normalizedName = name === "HomeIcon" ? "Home" : name;
  const IconComponent = (LucideIcons as any)[normalizedName];

  if (!IconComponent) {
    // Fallback if the icon name doesn't exist
    return <LucideIcons.Sparkles {...props} />;
  }

  return <IconComponent {...props} />;
}
