import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CharacterPresetTemplate } from "@/types/preset";
import { GetNestedType, NestedKeyOf } from "@/types/util";
import { useState, useEffect, useRef } from "react";

interface CharacterBasicFormProps {
    updatePreset?: <K extends NestedKeyOf<CharacterPresetTemplate>>(
        key: K,
        value: GetNestedType<CharacterPresetTemplate, K>
    ) => void;
    preset: CharacterPresetTemplate;
    presetId: string;
}

export function CharacterBasic({
    updatePreset,
    preset,
    presetId,
}: CharacterBasicFormProps) {
    // 1. Synchronous local states
    const [name, setName] = useState(preset.name || "");
    const [nickName, setNickName] = useState(preset.nick_name?.join(", ") || "");
    const [botId, setBotId] = useState(preset.bot_id || "");
    const [ownerId, setOwnerId] = useState(preset.owner_id || "");

    // 2. Ref to keep track of debounce timeouts
    const saveTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

    // 3. Reset local states ONLY when presetId changes (switching characters)
    useEffect(() => {
        setName(preset.name || "");
        setNickName(preset.nick_name?.join(", ") || "");
        setBotId(preset.bot_id || "");
        setOwnerId(preset.owner_id || "");

        // Clear timeouts on switch
        Object.values(saveTimeouts.current).forEach(clearTimeout);
        saveTimeouts.current = {};
    }, [presetId]);

    // 4. Synchronous state update and debounced DB write helper
    const handleFieldChange = (
        key: NestedKeyOf<CharacterPresetTemplate>,
        value: string,
        setter: (val: string) => void,
        formatValue?: (val: string) => any
    ) => {
        // Sync state instantly
        setter(value);

        // Cancel previous timer
        if (saveTimeouts.current[key]) {
            clearTimeout(saveTimeouts.current[key]);
        }

        // Set timer to write to DB
        saveTimeouts.current[key] = setTimeout(() => {
            const formatted = formatValue ? formatValue(value) : value;
            updatePreset?.(key, formatted);
        }, 400);
    };

    // Clean up timeouts on unmount
    useEffect(() => {
        return () => {
            Object.values(saveTimeouts.current).forEach(clearTimeout);
        };
    }, []);

    return (
        <div className="grid gap-6">
            <Card className="rounded-xl">
                <CardHeader className="p-6">
                    <CardTitle>基础信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6 pt-0">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">bot名字</Label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                placeholder="请输入bot名字"
                                onChange={(e) => handleFieldChange("name", e.target.value, setName)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nick_name">bot昵称 (用英文逗号 , 分割)</Label>
                            <Input
                                id="nick_name"
                                type="text"
                                value={nickName}
                                placeholder="请输入bot昵称，例如：小助手, 煕煕"
                                className="rounded-lg"
                                onChange={(e) =>
                                    handleFieldChange(
                                        "nick_name",
                                        e.target.value,
                                        setNickName,
                                        (val) => val.split(",").map((s) => s.trim())
                                    )
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bot_id">botid (QQ号)</Label>
                            <Input
                                id="bot_id"
                                type="text"
                                value={botId}
                                placeholder="请输入bot的QQ号"
                                className="rounded-lg"
                                onChange={(e) => handleFieldChange("bot_id", e.target.value, setBotId)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="owner_id">主人id (QQ号)</Label>
                            <Input
                                id="owner_id"
                                type="text"
                                value={ownerId}
                                placeholder="请输入主人的QQ号"
                                className="rounded-lg"
                                onChange={(e) => handleFieldChange("owner_id", e.target.value, setOwnerId)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
