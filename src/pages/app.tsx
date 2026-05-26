"use client";

import { MainLayout } from "@/components/main-layout";
import { CharacterList } from "@/components/character-list";
import { usePresets } from "@/hooks/use-preset";
import { NewPresetDialog } from "@/components/new-preset-dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function Page() {
    const presets = usePresets();
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <MainLayout>
            <div className="container flex flex-col py-6 px-6 md:px-12 lg:px-24">
                <div className="flex flex-col md:flex-row md:items-center  justify-between gap-4 mb-6">
                    <div className="text-2xl md:text-3xl font-bold"></div>
                    <div className="flex items-center gap-4">
                        <Input
                            placeholder="搜索预设..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-64"
                            autoComplete="off"
                        />
                        <div className="flex gap-2">
                            <NewPresetDialog />
                        </div>
                    </div>
                </div>
                <CharacterList presets={presets} searchQuery={searchQuery} />
            </div>
        </MainLayout>
    );
}
