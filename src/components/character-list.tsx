"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import {
  deletePreset,
  PresetModel,
} from "@/hooks/use-preset";
import { Link, useNavigate } from "react-router";


interface CharacterListProps {
  presets: PresetModel[];
  searchQuery: string;
}

type SortKey = "name" | "type" | "lastModified";

export function CharacterList({
  presets: initialCharacters,
  searchQuery,
}: CharacterListProps) {
  const [characters, setCharacters] = useState([] as PresetModel[]);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    null,
  );

  const navigate = useNavigate();

  const sortCharacters = (key: SortKey) => {
    const newSortOrder =
      key === sortKey && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(newSortOrder);

    const sortedCharacters = [...characters].sort((a, b) => {
      if (a[key] < b[key]) return sortOrder === "asc" ? -1 : 1;
      if (a[key] > b[key]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setCharacters(sortedCharacters);
  };

  useEffect(() => {
    const filteredCharacters = initialCharacters.filter((character) =>
      character.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setCharacters(filteredCharacters);
  }, [initialCharacters, searchQuery]);

  if (initialCharacters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <img
          width="100"
          height="100"
          src="/images/empty-state.svg"
          alt="No presets"
          className="w-48 h-48 mb-4"
        />
        <div className="text-2xl font-bold tracking-tight">没有预设</div>
        <div className="text-base text-muted-foreground text-center pt-4">
          点击右上角的按钮新建或者导入预设
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">
              <Button
                variant="ghost"
                onClick={() => sortCharacters("name")}
                className={`hover:bg-transparent transition-all ${
                  sortKey === "name" ? "text-primary" : ""
                }`}
              >
                名称
                {sortKey === "name" ? (
                  <ArrowUp
                    className={`ml-2 h-4 w-4 transition-transform duration-200  ${
                      sortOrder === "asc" ? "" : "rotate-180"
                    }`}
                  />
                ) : (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead className="table-cell">
              <Button
                variant="ghost"
                onClick={() => sortCharacters("type")}
                className={`hover:bg-transparent transition-all ${
                  sortKey === "type" ? "text-primary" : ""
                }`}
              >
                类型
                {sortKey === "type" ? (
                  <ArrowUp
                    className={`ml-2 h-4 w-4 transition-transform duration-200  ${
                      sortOrder === "asc" ? "" : "rotate-180"
                    }`}
                  />
                ) : (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead className="table-cell">
              <Button
                variant="ghost"
                onClick={() => sortCharacters("lastModified")}
                className={`hover:bg-transparent transition-all ${
                  sortKey === "lastModified" ? "text-primary" : ""
                }`}
              >
                最后修改
                {sortKey === "lastModified" ? (
                  <ArrowUp
                    className={`ml-2 h-4 w-4 transition-transform duration-200  ${
                      sortOrder === "asc" ? "" : "rotate-180"
                    }`}
                  />
                ) : (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead className="w-[200px] text-center">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {characters.map((character) => (
            <TableRow key={character.id}>
              <TableCell>
                <Link
                  to={`/character/${character.id}`}
                  className="font-medium hover:text-primary ml-4"
                >
                  {character.name}
                </Link>
              </TableCell>
              <TableCell className="table-cell">
                <span className="ml-4">
                  {character.type === "main" ? "主插件预设" : "伪装预设"}
                </span>
              </TableCell>
              <TableCell className="table-cell ml-4">
                <span className="ml-4">
                  {new Date(character.lastModified).toLocaleString()}
                </span>
              </TableCell>
              <TableCell className="w-[200px] text-center">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs"
                    onClick={() => {
                      navigate(`/character/${character.id}`);
                    }}
                  >
                    编辑
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    onClick={() => {
                      setSelectedCharacterId(character.id);
                      setOpenAlert(true);
                    }}
                  >
                    删除
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除?</AlertDialogTitle>
            <AlertDialogDescription>
              此操作无法撤销. 你确定要删除这个预设吗?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setSelectedCharacterId(null);
              }}
            >
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deletePreset(selectedCharacterId!);
                setOpenAlert(false);
                setSelectedCharacterId(null);
              }}
            >
              确认
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
