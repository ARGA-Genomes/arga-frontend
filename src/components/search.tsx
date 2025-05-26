import { TextInput, TextInputProps } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Search(props: TextInputProps) {
  const router = useRouter();

  const [value, setValue] = useState<string>("");

  function onSearch() {
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  return (
    <TextInput
      {...props}
      value={value}
      onChange={(val) => {
        setValue(val.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSearch();
      }}
    />
  );
}
