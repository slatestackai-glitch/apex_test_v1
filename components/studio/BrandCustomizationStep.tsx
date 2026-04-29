"use client";

import { Palette } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { StudioInput } from "@/lib/projectSchema";

export function BrandCustomizationStep({
  value,
  onBrandChange,
  onClientNameChange,
}: {
  value: StudioInput;
  onBrandChange: (patch: Partial<StudioInput["brand"]>) => void;
  onClientNameChange: (name: string) => void;
}) {
  const brand = value.brand;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Card className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Brand & UI Customization</h2>
          <p className="text-sm text-[var(--apex-text-secondary)]">
            Customize how the generated demo and PDF appear for the client.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="font-medium">Client name</span>
            <Input
              value={brand.clientName}
              onChange={(event) => {
                onBrandChange({ clientName: event.target.value });
                onClientNameChange(event.target.value);
              }}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Assistant name</span>
            <Input value={brand.assistantName} onChange={(event) => onBrandChange({ assistantName: event.target.value })} />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Primary brand color</span>
            <Input type="color" value={brand.primaryColor} onChange={(event) => onBrandChange({ primaryColor: event.target.value })} />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Secondary brand color</span>
            <Input
              type="color"
              value={brand.secondaryColor}
              onChange={(event) => onBrandChange({ secondaryColor: event.target.value })}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Logo initials</span>
            <Input value={brand.logoInitials} onChange={(event) => onBrandChange({ logoInitials: event.target.value.toUpperCase() })} />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Tone of voice</span>
            <Input value={brand.tone} onChange={(event) => onBrandChange({ tone: event.target.value })} />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">UI density</span>
            <Select value={brand.uiDensity} onChange={(event) => onBrandChange({ uiDensity: event.target.value as StudioInput["brand"]["uiDensity"] })}>
              <option value="Compact">Compact</option>
              <option value="Balanced">Balanced</option>
              <option value="Premium">Premium</option>
            </Select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">CTA style</span>
            <Select value={brand.ctaStyle} onChange={(event) => onBrandChange({ ctaStyle: event.target.value as StudioInput["brand"]["ctaStyle"] })}>
              <option value="Solid">Solid</option>
              <option value="Outline">Outline</option>
              <option value="Soft">Soft</option>
            </Select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Border radius</span>
            <Select
              value={brand.borderRadius}
              onChange={(event) => onBrandChange({ borderRadius: event.target.value as StudioInput["brand"]["borderRadius"] })}
            >
              <option value="Soft">Soft</option>
              <option value="Medium">Medium</option>
              <option value="Sharp">Sharp</option>
            </Select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Font style</span>
            <Select value={brand.font} onChange={(event) => onBrandChange({ font: event.target.value })}>
              <option value="Hind">Hind</option>
              <option value="Hind + Inter">Hind + Inter fallback</option>
              <option value="System">System fallback</option>
            </Select>
          </label>

          <label className="space-y-1 text-sm sm:col-span-2">
            <span className="font-medium">Welcome message</span>
            <Textarea value={brand.welcomeMessage} onChange={(event) => onBrandChange({ welcomeMessage: event.target.value })} />
          </label>
        </div>

        <p className="text-xs text-[var(--apex-text-secondary)]">
          Brand settings apply to the PDF, demo website, and implementation brief.
        </p>
      </Card>

      <Card className="space-y-3">
        <h3 className="text-base font-semibold">Live preview</h3>

        <div className="rounded-xl border border-[var(--apex-border)] p-3">
          <div className="flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold text-white"
              style={{ backgroundColor: "#C8102E" }}
            >
              {brand.logoInitials || "AX"}
            </span>
            <div>
              <p className="text-sm font-semibold">{brand.clientName}</p>
              <p className="text-xs text-[var(--apex-text-secondary)]">Generated page header preview</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--apex-border)] p-3">
          <p className="mb-2 text-xs text-[var(--apex-text-secondary)]">Assistant card preview</p>
          <div className="rounded-xl border p-3" style={{ borderColor: brand.secondaryColor }}>
            <p className="text-sm font-semibold" style={{ color: brand.primaryColor }}>
              {brand.assistantName}
            </p>
            <p className="mt-1 text-sm">{brand.welcomeMessage}</p>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--apex-border)] p-3">
          <p className="mb-2 text-xs text-[var(--apex-text-secondary)]">CTA and PDF accent preview</p>
          <button
            type="button"
            className="rounded-xl px-3 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: brand.primaryColor }}
          >
            Get personalized quote
          </button>
          <div className="mt-2 h-2 rounded-full" style={{ backgroundColor: "#C8102E" }} />
          <div className="mt-1 h-2 rounded-full" style={{ backgroundColor: brand.secondaryColor }} />
        </div>

        <div className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-3 text-sm">
          <p className="mb-1 font-semibold">
            <Palette className="mr-1 inline h-4 w-4" /> Overlay header preview
          </p>
          <div className="rounded-lg px-3 py-2 text-white" style={{ backgroundColor: brand.primaryColor }}>
            APEX Overlay | {brand.clientName}
          </div>
        </div>
      </Card>
    </div>
  );
}
