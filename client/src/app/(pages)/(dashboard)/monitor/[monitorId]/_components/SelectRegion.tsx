import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegionSelector {
  selectedRegion: string;
  handleSelect: (value: string) => void;
}
export function RegionSelector({
  selectedRegion,
  handleSelect,
}: RegionSelector) {
  return (
    <Select onValueChange={handleSelect} defaultValue={selectedRegion}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Region" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Regions</SelectLabel>
          <SelectItem value="Europe">Europe</SelectItem>
          <SelectItem value="ASIA (JAPAN)">Asia (Japan)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
