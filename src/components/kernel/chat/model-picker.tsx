import { MODEL_PRESETS, type ProviderPreset } from "@/lib/kernel-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ModelPicker({
  value,
  preset,
  onChange,
}: {
  value: string;
  preset: ProviderPreset;
  onChange: (id: string) => void;
}) {
  const models = MODEL_PRESETS[preset];
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-auto gap-2 border-none bg-transparent px-2 text-sm shadow-none focus:ring-0">
        <SelectValue placeholder="Model" />
      </SelectTrigger>
      <SelectContent>
        {models.map((m) => (
          <SelectItem key={m.id} value={m.id}>
            <span className="flex flex-col">
              <span>{m.label}</span>
              <span className="text-xs text-muted-foreground">{m.note}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

