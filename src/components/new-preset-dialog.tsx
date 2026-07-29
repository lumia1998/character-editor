import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { createCharacterPreset } from "@/hooks/use-preset";
import { useNavigate } from "react-router";

export function NewPresetDialog() {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleCreatePreset = async (e: React.MouseEvent) => {
        if (!name.trim()) {
            setError("请输入预设名称");
            e.preventDefault();
            return;
        }

        setError("");
        const id = await createCharacterPreset(name);
        setName("");
        navigate(`/character/${id}`);
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" className="flex-1 md:flex-none">
                    <Plus className="w-4 h-4 md:mr-0 md:w-auto md:h-auto" />

                    <span className="hidden md:inline">新建预设</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] sm:max-w-[90vw] md:max-w-[425px] rounded-2xl">
                <DialogHeader>
                    <DialogTitle>新建预设</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm">
                            名称
                        </label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError("");
                            }}
                            className={error ? "border-red-500" : ""}
                        />
                        {error && <span className="text-sm text-red-500">{error}</span>}
                    </div>
                </div>
                <DialogClose asChild>
                    <Button onClick={handleCreatePreset}>创建</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}
