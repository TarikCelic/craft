"use client";

import {addProduct, getCategories} from "@/data/admin/add-product/actions";
import {
    useState,
    useCallback,
    ChangeEvent,
    FormEvent,
    useEffect,
} from "react";
import {toast} from "sonner";
import {RoomType} from "@/app/generated/prisma";
import {Reveal} from "@/components/ui/Reveal";

interface ImageItem {
    file: File;
    preview: string;
}

interface Variant {
    color: string;
    images: ImageItem[];
}

interface ProductFormData {
    name: string;
    description: string;
    dimensions: string;
    price: string;
    category: string;
    materials: string[];
    roomTypes: RoomType[];
}

const MATERIALS_LIST: string[] = [
    "Solid Wood",
    "Oak",
    "Pine",
    "Beech",
    "Ash",
    "Walnut",
    "Birch",
    "Teak",
    "Acacia",
    "Bamboo",
    "Veneer",
    "MDF",
    "Chipboard",
    "Plywood",
    "OSB",

    "Steel",
    "Stainless Steel",
    "Aluminum",
    "Iron",
    "Chrome",
    "Brass",

    "Fabric",
    "Velvet",
    "Linen",
    "Cotton",
    "Polyester",
    "Leather",
    "Faux Leather",
    "Microfiber",

    "Glass",
    "Tempered Glass",
    "Plastic",
    "Polypropylene",
    "Foam",
    "Rattan",
    "Wicker",
    "Marble",
    "Ceramic",
    "Concrete",
];

const ROOM_TYPE_LABELS: Record<RoomType, string> = {
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

const PREDEFINED_COLORS = [
    {name: "White", hex: "#ffffff"},
    {name: "Black", hex: "#111827"},
    {name: "Gray", hex: "#9ca3af"},
    {name: "Light Wood", hex: "#fcd34d"},
    {name: "Dark Wood", hex: "#78350f"},
    {name: "Blue", hex: "#3b82f6"},
    {name: "Green", hex: "#22c55e"},
    {name: "Red", hex: "#ef4444"},
];

const EMPTY_FORM: ProductFormData = {
    name: "",
    description: "",
    dimensions: "",
    price: "",
    category: "",
    materials: [],
    roomTypes: [],
};

export default function DarkProductForm() {
    const [formData, setFormData] = useState<ProductFormData>(EMPTY_FORM);
    const [variants, setVariants] = useState<Variant[]>([]);
    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState<{ id: number; name: string }[]>(
        [],
    );
    const [categoryInput, setCategoryInput] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const filteredCategories = categories.filter((c) =>
        c.name.toLowerCase().includes(categoryInput.toLowerCase()),
    );

    const handleInputChange = useCallback(
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const {name, value} = e.target;
            setFormData((prev) => ({...prev, [name]: value}));
        },
        [],
    );

    const handleMaterialToggle = (material: string) => {
        setFormData((prev) => ({
            ...prev,
            materials: prev.materials.includes(material)
                ? prev.materials.filter((m) => m !== material)
                : [...prev.materials, material],
        }));
    };

    const handleRoomTypeToggle = (roomType: RoomType) => {
        setFormData((prev) => ({
            ...prev,
            roomTypes: prev.roomTypes.includes(roomType)
                ? prev.roomTypes.filter((r) => r !== roomType)
                : [...prev.roomTypes, roomType],
        }));
    };

    const addVariant = () => {
        setVariants((prev) => [
            ...prev,
            {color: PREDEFINED_COLORS[0].hex, images: []},
        ]);
    };

    const removeVariant = (index: number) => {
        setVariants((prev) => prev.filter((_, i) => i !== index));
    };

    const handleVariantColorChange = (index: number, color: string) => {
        setVariants((prev) => {
            const newVariants = [...prev];
            newVariants[index] = {...newVariants[index], color};
            return newVariants;
        });
    };

    const handleImageUpload = (
        variantIndex: number,
        e: ChangeEvent<HTMLInputElement>,
    ) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);

        setVariants((prev) => {
            const newVariants = [...prev];
            const currentImages = newVariants[variantIndex].images;
            const availableSlots = 5 - currentImages.length;

            if (availableSlots <= 0) return prev;

            const filesToAdd: ImageItem[] = files
                .slice(0, availableSlots)
                .map((file) => ({
                    file,
                    preview: URL.createObjectURL(file),
                }));

            newVariants[variantIndex] = {
                ...newVariants[variantIndex],
                images: [...currentImages, ...filesToAdd],
            };
            return newVariants;
        });
    };

    const removeImage = (variantIndex: number, imageIndex: number) => {
        setVariants((prev) => {
            const newVariants = [...prev];
            newVariants[variantIndex] = {
                ...newVariants[variantIndex],
                images: newVariants[variantIndex].images.filter(
                    (_, i) => i !== imageIndex,
                ),
            };
            return newVariants;
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("category", categoryInput);
        data.append("dimensions", formData.dimensions);
        data.append("materials", JSON.stringify(formData.materials));
        data.append("roomTypes", JSON.stringify(formData.roomTypes));
        data.append("price", formData.price);
        data.append(
            "variants",
            JSON.stringify(variants.map((v, vID) => ({color: v.color, vID}))),
        );
        variants.forEach((variant, vIdx) => {
            variant.images.forEach((img) => {
                data.append(`images_${vIdx}`, img.file);
            });
        });

        setLoading(true);
        const result = await addProduct(data);

        if (!result.success) {
            toast.error(result.error);
        } else {
            toast.success("Product successfully added!");
            setFormData(EMPTY_FORM);
            setVariants([]);
            setCategoryInput("");
        }
        setLoading(false);
    };

    const inputStyles =
        "w-full p-3 border border-gray-700 rounded-sm text-gray-100 placeholder-gray-500 transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-transparent";

    return (
        <Reveal fade duration={1000} className="min-h-screen text-gray-100">
            <div className="max-w-4xl border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-800">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent uppercase tracking-wider">
                        New Product
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Enter specifications for your new furniture piece.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-12">
                    <section className="space-y-6">
                        <h2 className="text-xl font-semibold text-blue-400">
                            Basic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">
                                    Product Name
                                </label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={inputStyles}
                                    placeholder="e.g. Modern Oak Table"
                                    required
                                />
                            </div>

                            <div className="space-y-2 relative">
                                <label className="text-sm font-medium text-gray-400">
                                    Category
                                </label>
                                <input
                                    value={categoryInput}
                                    onChange={(e) => {
                                        setCategoryInput(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    onBlur={() =>
                                        setTimeout(() => setShowSuggestions(false), 150)
                                    }
                                    className={inputStyles}
                                    placeholder="Tables, Chairs... or enter a new one"
                                    autoComplete="off"
                                    required
                                />
                                {showSuggestions &&
                                    (filteredCategories.length > 0 || categoryInput.trim()) && (
                                        <ul className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-xl">
                                            {filteredCategories.map((c) => (
                                                <li
                                                    key={c.id}
                                                    onMouseDown={() => {
                                                        setCategoryInput(c.name);
                                                        setShowSuggestions(false);
                                                    }}
                                                    className="px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 cursor-pointer flex items-center justify-between"
                                                >
                                                    {c.name}
                                                    <span className="text-xs text-gray-600">
                            existing
                          </span>
                                                </li>
                                            ))}
                                            {!filteredCategories.some(
                                                    (c) =>
                                                        c.name.toLowerCase() === categoryInput.toLowerCase(),
                                                ) &&
                                                categoryInput.trim() && (
                                                    <li
                                                        onMouseDown={() => setShowSuggestions(false)}
                                                        className="px-4 py-2.5 text-sm text-blue-400 hover:bg-gray-800 cursor-pointer flex items-center gap-2"
                                                    >
                                                        <span>+</span> Create &quot;{categoryInput}&quot;
                                                    </li>
                                                )}
                                        </ul>
                                    )}
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-gray-400">
                                    Product Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className={inputStyles}
                                    placeholder="Details about craftsmanship, style..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">
                                    Dimensions
                                </label>
                                <input
                                    name="dimensions"
                                    value={formData.dimensions}
                                    onChange={handleInputChange}
                                    className={inputStyles}
                                    placeholder="200x90x75 cm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">
                                    Price (BAM)
                                </label>
                                <input
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className={inputStyles}
                                    placeholder="0.00"
                                    step="0.01"
                                    min={0}
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-blue-400">Materials</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {MATERIALS_LIST.map((material) => (
                                <button
                                    key={material}
                                    type="button"
                                    onClick={() => handleMaterialToggle(material)}
                                    className={`p-3 rounded-sm border text-sm font-medium transition-all ${
                                        formData.materials.includes(material)
                                            ? "bg-blue-600/20 border-blue-500 text-blue-400"
                                            : "border-gray-700 text-gray-400 hover:border-gray-500"
                                    }`}
                                >
                                    {material}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-blue-400">
                            Room Type
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {(Object.entries(ROOM_TYPE_LABELS) as [RoomType, string][]).map(
                                ([enumKey, label]) => (
                                    <button
                                        key={enumKey}
                                        type="button"
                                        onClick={() => handleRoomTypeToggle(enumKey)}
                                        className={`p-3 rounded-sm border text-sm font-medium transition-all ${
                                            formData.roomTypes.includes(enumKey)
                                                ? "bg-blue-600/20 border-blue-500 text-blue-400"
                                                : "border-gray-700 text-gray-400 hover:border-gray-500"
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ),
                            )}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-blue-400">
                                Variants & Images
                            </h2>
                            <button
                                type="button"
                                onClick={addVariant}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors"
                            >
                                + Add Variant
                            </button>
                        </div>

                        <div className="space-y-8">
                            {variants.map((variant, vIdx) => (
                                <div
                                    key={vIdx}
                                    className="relative p-6 bg-gray-800/40 border border-gray-700 rounded-2xl hover:border-gray-600 transition-colors"
                                >
                                    <button
                                        type="button"
                                        onClick={() => removeVariant(vIdx)}
                                        disabled={loading}
                                        className="absolute -top-3 -right-3 w-8 h-8 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full border border-red-500/20 flex items-center justify-center transition-all"
                                    >
                                        ×
                                    </button>

                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="flex flex-col gap-2 md:w-36 shrink-0">
                                            <label
                                                className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                Color
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {PREDEFINED_COLORS.map((c) => (
                                                    <button
                                                        key={c.hex}
                                                        type="button"
                                                        onClick={() =>
                                                            handleVariantColorChange(vIdx, c.hex)
                                                        }
                                                        title={c.name}
                                                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                                                            variant.color === c.hex
                                                                ? "border-blue-500 scale-110 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                                                                : "border-gray-600 hover:scale-105"
                                                        }`}
                                                        style={{backgroundColor: c.hex}}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs font-medium text-gray-400 mt-2">
                        {PREDEFINED_COLORS.find((c) => c.hex === variant.color)
                            ?.name || variant.color}
                      </span>
                                        </div>

                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-300">
                          Variant Gallery (max 5)
                        </span>
                                                <span className="text-xs text-gray-500">
                          {variant.images.length}/5
                        </span>
                                            </div>

                                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                                                {variant.images.map((img, iIdx) => (
                                                    <div
                                                        key={iIdx}
                                                        className="relative aspect-square rounded-xl overflow-hidden border border-gray-600 group/img"
                                                    >
                                                        <img
                                                            src={img.preview}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            disabled={loading}
                                                            onClick={() => removeImage(vIdx, iIdx)}
                                                            className="absolute inset-0 bg-red-600/80 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity"
                                                        >
                              <span className="text-white text-xs font-bold uppercase tracking-tighter">
                                Remove
                              </span>
                                                        </button>
                                                    </div>
                                                ))}

                                                {variant.images.length < 5 && (
                                                    <label
                                                        className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:bg-gray-700/50 hover:border-gray-500 transition-all text-gray-500">
                                                        <span className="text-2xl">+</span>
                                                        <input
                                                            type="file"
                                                            disabled={loading}
                                                            multiple
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => handleImageUpload(vIdx, e)}
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="pt-8 border-t border-gray-800 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-10 py-4 bg-blue-600 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            {loading ? "Publishing..." : "PUBLISH PRODUCT"}
                        </button>
                    </div>
                </form>
            </div>
        </Reveal>
    );
}