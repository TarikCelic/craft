"use client";

import {useRef, useState, useCallback, useMemo, useEffect} from "react";
import {
    Label,
    Checkbox,
    Slider,
    Switch,
    ListBox,
    Select,
} from "@heroui/react";
import {useRouter, useSearchParams} from "next/navigation";
import {getCategories} from "@/data/admin/add-product/actions";
import {RoomType} from "@/app/generated/prisma";

const COLORS = [
    "#ffffff",
    "#111827",
    "#9ca3af",
    "#fcd34d",
    "#78350f",
    "#3b82f6",
    "#22c55e",
    "#ef4444",
];
const MATERIALS = [
    "Solid Wood", "Oak", "Pine", "Beech", "Ash", "Walnut",
    "Birch", "Teak", "Acacia", "Bamboo", "Veneer", "MDF",
    "Chipboard", "Plywood", "OSB", "Steel", "Stainless Steel",
    "Aluminum", "Iron", "Chrome", "Brass", "Fabric", "Velvet",
    "Linen", "Cotton", "Polyester", "Leather", "Faux Leather",
    "Microfiber", "Glass", "Tempered Glass", "Plastic",
    "Polypropylene", "Foam", "Rattan", "Wicker", "Marble",
    "Ceramic", "Concrete",
];
export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
    LIVINGROOM: "Living Room",
    BEDROOM: "Bedroom",
    DININGROOM: "Dining Room",
    KITCHEN: "Kitchen",
    BATHROOM: "Bathroom",
    OFFICE: "Home Office",
    KIDSROOM: "Kids Room",
    HALLWAY: "Hallway",
    OUTDOOR: "Outdoor",
    BALCONY: "Balcony",
    GAMINGROOM: "Gaming Room",
};
const INITIAL_PRICE: [number, number] = [0, 1000];

function SectionTitle({children}: { children: React.ReactNode }) {
    return (
        <h3 className="text-[10px] font-neutral-900 uppercase tracking-[0.3em] text-neutral-400 mb-4">
            {children}
        </h3>
    );
}

function ColorSwatch({
                         color,
                         isSelected,
                         onClick,
                     }: {
    color: string;
    isSelected: boolean;
    onClick: () => void;
}) {
    const isLight = ["#ffffff", "#fcd34d", "#9ca3af"].includes(color);

    return (
        <button
            onClick={onClick}
            title={color}
            aria-pressed={isSelected}
            className={`
        relative w-5 h-5 rounded-full transition-all duration-150
        ${
                isSelected
                    ? "ring-2 ring-offset-2 ring-blue-500 scale-110"
                    : "ring-1 ring-neutral-900/10 hover:ring-2 hover:ring-blue-300 hover:scale-105"
            }
      `}
            style={{backgroundColor: color}}
        >
            {isSelected && (
                <span
                    className={`
            absolute inset-0 flex items-center justify-center
            text-[10px] font-neutral-900
            ${isLight ? "text-neutral-900/60" : "text-white"}
          `}
                >
          ✓
        </span>
            )}
        </button>
    );
}

interface FilterSidebarProps {
    isMobile?: boolean;
    onClose?: () => void;
}

export default function FilterSidebar({
                                          isMobile = false,
                                          onClose,
                                      }: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [price, setPrice] = useState<[number, number]>(INITIAL_PRICE);
    const [onSale, setOnSale] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const currentCategory = searchParams.get("category");
    const selectedColors = useMemo(
        () => searchParams.getAll("color"),
        [searchParams],
    );
    const selectedMaterials = useMemo(
        () => searchParams.getAll("material"),
        [searchParams],
    );
    const selectedRooms = useMemo(
        () => searchParams.getAll("room"),
        [searchParams],
    );

    const pushParams = useCallback(
        (mutate: (p: URLSearchParams) => void, replace = false) => {
            const params = new URLSearchParams(searchParams);
            mutate(params);
            const url = `/shop?${params.toString()}`;
            replace ? router.replace(url) : router.push(url);
        },
        [searchParams, router],
    );

    const handleOnSale = () => {
        const next = !onSale;
        setOnSale(next);
        pushParams((params) => {
            next ? params.set("onSale", "true") : params.delete("onSale");
        });
    };

    const toggleMultiParam = useCallback(
        (key: string, value: string) => {
            pushParams((params) => {
                const current = params.getAll(key);
                params.delete(key);
                if (current.includes(value)) {
                    current
                        .filter((v) => v !== value)
                        .forEach((v) => params.append(key, v));
                } else {
                    [...current, value].forEach((v) => params.append(key, v));
                }
            }, true);
        },
        [pushParams],
    );

    const handleCategory = useCallback(
        (category: string) => {
            pushParams((params) => {
                params.get("category") === category
                    ? params.delete("category")
                    : params.set("category", category);
            });
        },
        [pushParams],
    );

    const handleColorChange = useCallback(
        (color: string) => toggleMultiParam("color", color),
        [toggleMultiParam],
    );

    const handleMaterials = useCallback(
        (material: string) => toggleMultiParam("material", material),
        [toggleMultiParam],
    );

    const updatePrice = useCallback(
        (val: number | number[]) => {
            const [min, max] = Array.isArray(val) ? val : [val, val];
            setPrice([min, max]);

            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                pushParams((params) => {
                    min > 0 ? params.set("min", String(min)) : params.delete("min");
                    max < 1000 ? params.set("max", String(max)) : params.delete("max");
                }, true);
            }, 400);
        },
        [pushParams],
    );

    const reset = useCallback(() => {
        setPrice(INITIAL_PRICE);
        setOnSale(false);
        router.replace("/shop");
    }, [router]);

    const [categories, setCategories] = useState<{ id: number; name: string }[]>(
        [],
    );

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-8">
                {!isMobile && (
                    <div className="flex items-center justify-between">
                        <p className="text-2xl font-extrabold uppercase tracking-tight">
                            Filters
                        </p>
                        <button
                            onClick={reset}
                            className="text-xs font-semibold text-neutral-400 hover:text-neutral-900 underline underline-offset-2 transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                )}

                <section>
                    <Switch isSelected={onSale} onChange={handleOnSale}>
                        <Switch.Control>
                            <Switch.Thumb/>
                        </Switch.Control>
                        <Switch.Content>
                            <Label className="text-sm font-semibold text-neutral-700">
                                On Sale
                            </Label>
                        </Switch.Content>
                    </Switch>
                </section>

                <SectionTitle>Category</SectionTitle>
                <section className="w-full px-1">
                    <div className="flex flex-col gap-3">
                        {categories.map((cat) => (
                            <Checkbox
                                key={cat.name}
                                isSelected={currentCategory === cat.name}
                                onChange={() => handleCategory(cat.name)}
                                className="flex items-center gap-2"
                            >
                                <Checkbox.Control>
                                    <Checkbox.Indicator/>
                                </Checkbox.Control>
                                <Checkbox.Content>
                                    <Label className="text-sm font-medium text-neutral-700 cursor-pointer">
                                        {cat.name}
                                    </Label>
                                </Checkbox.Content>
                            </Checkbox>
                        ))}
                    </div>
                </section>

                <SectionTitle>Color</SectionTitle>
                <section className="w-full px-1">
                    <div className="flex flex-wrap gap-2">
                        {COLORS.map((color) => (
                            <ColorSwatch
                                key={color}
                                color={color}
                                isSelected={selectedColors.includes(color)}
                                onClick={() => handleColorChange(color)}
                            />
                        ))}
                    </div>
                </section>

                <SectionTitle>Price</SectionTitle>
                <section className="w-full px-1">
                    <Slider
                        value={price}
                        onChange={updatePrice}
                        minValue={0}
                        maxValue={1000}
                        step={10}
                        formatOptions={{style: "currency", currency: "BAM"}}
                    >
                        <Slider.Output/>
                        <Slider.Track>
                            {({state}: { state: { values: number[] } }) => (
                                <>
                                    <Slider.Fill/>
                                    {state.values.map((_, i) => (
                                        <Slider.Thumb key={i} index={i}/>
                                    ))}
                                </>
                            )}
                        </Slider.Track>
                    </Slider>
                </section>

                <SectionTitle>Materials</SectionTitle>
                <section className="pb-4 px-1">
                    <Select
                        className="w-full"
                        placeholder="Select materials"
                        selectionMode="multiple"
                    >
                        <Select.Trigger>
                            <Select.Value/>
                            <Select.Indicator/>
                        </Select.Trigger>

                        <Select.Popover>
                            <ListBox selectionMode="multiple">
                                {MATERIALS.map((material) => (
                                    <ListBox.Item
                                        key={material}
                                        id={material}
                                        textValue={material}
                                        onClick={() => toggleMultiParam("material", material)}
                                    >
                                        {material}
                                        {selectedMaterials.includes(material) && (
                                            <ListBox.ItemIndicator/>
                                        )}
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                </section>

                <SectionTitle>Room Type</SectionTitle>
                <section className="pb-4 px-1">
                    <Select
                        className="w-full"
                        placeholder="Odaberi sobe"
                        selectionMode="multiple"
                    >
                        <Select.Trigger>
                            <Select.Value/>
                            <Select.Indicator/>
                        </Select.Trigger>

                        <Select.Popover>
                            <ListBox selectionMode="multiple">
                                {Object.entries(ROOM_TYPE_LABELS).map(([enumKey, label]) => (
                                    <ListBox.Item
                                        key={enumKey}
                                        id={enumKey}
                                        textValue={label}
                                        onClick={() => toggleMultiParam("room", enumKey)}
                                    >
                                        {label}
                                        {selectedRooms.includes(enumKey) && (
                                            <ListBox.ItemIndicator/>
                                        )}
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                </section>
            </div>

            {isMobile && (
                <div className="pt-5 mt-5 border-t border-neutral-100 flex gap-3 shrink-0">
                    <button
                        onClick={reset}
                        className="flex-1 py-3 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-neutral-900 text-white text-sm font-bold hover:bg-neutral-800 transition-colors"
                    >
                        Apply
                    </button>
                </div>
            )}
        </div>
    );
}
