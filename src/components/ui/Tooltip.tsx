import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <BaseTooltip.Provider>
      <BaseTooltip.Root>
        <BaseTooltip.Trigger render={children} />
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner sideOffset={6} className="z-[70]">
            <BaseTooltip.Popup className="rounded-lg bg-ink px-2 py-1 text-xs font-medium text-white shadow-modal transition data-[ending-style]:opacity-0 data-[starting-style]:opacity-0">
              {content}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}
