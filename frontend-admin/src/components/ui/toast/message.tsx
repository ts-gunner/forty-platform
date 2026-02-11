import { motion } from "framer-motion";
import type {Variants} from "framer-motion"
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";

import Button from "@/components/ui/button/Button";
import { cn } from "@/utils/common";

type Variant = "default" | "success" | "error" | "warning";
type Position = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";

interface ActionButton {
  label: string;
  onClick: () => void;
  variant?: "primary" | "outline" | "link" | "default";
}

interface ToasterProps {
  title?: string;
  message: string;
  variant?: Variant;
  duration?: number;
  position?: Position;
  actions?: ActionButton;
  onDismiss?: () => void;
  highlightTitle?: boolean;
}

export interface ToasterRef {
  show: (props: ToasterProps) => void;
}

const variantStyles: Record<Variant, string> = {
  default: "bg-card border-border text-foreground",
  success: "bg-card border-green-600/50",
  error: "bg-card border-destructive/50",
  warning: "bg-card border-amber-600/50",
};

const titleColor: Record<Variant, string> = {
  default: "text-foreground",
  success: "text-green-600 dark:text-green-400",
  error: "text-[#cf343d]",
  warning: "text-amber-600 dark:text-amber-400",
};

const iconColor: Record<Variant, string> = {
  default: "text-muted-foreground",
  success: "text-green-600 dark:text-green-400",
  error: "text-[#cf343d]",
  warning: "text-amber-600 dark:text-amber-400",
};

const variantIcons: Record<Variant, React.ComponentType<{ className?: string }>> = {
  default: Info,
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
};

const toastAnimation:Variants = {
  initial: { opacity: 0, y: 50, transform: "translateZ(0)" }, // 开启硬件加速
  animate: { 
    opacity: 1, 
    y: 0, 
    transform: "translateZ(0)",
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: 30, // 减小出场位移，减少动画负担
    transform: "translateZ(0)",
    transition: { 
      duration: 0.25, 
      ease: "easeIn", // 出场用 easeIn 更自然，避免卡顿感
      delay: 0.05 // 轻微延迟，让动画启动更平滑
    }
  },
};
const Toaster = forwardRef<ToasterRef, { defaultPosition?: Position }>(({ defaultPosition = "top-right" }, ref) => {
  const toastReference = useRef<ReturnType<typeof sonnerToast.custom> | null>(null);

  useImperativeHandle(ref, () => ({
    show({ title, message, variant = "default", duration =3000, position = defaultPosition, actions, onDismiss, highlightTitle }) {
      const Icon = variantIcons[variant];

      toastReference.current = sonnerToast.custom(
        (toastId) => (
          <motion.div
            variants={toastAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn("", variantStyles[variant])}
          >
            <div className="flex items-center justify-between  gap-2  w-full max-w-xs p-3 rounded-xl border shadow-md bg-white">
              <div className="flex items-items gap-2">
                <Icon className={cn("h-4 w-4 flex-shrink-0", iconColor[variant])} />
                <div className="space-y-0.5">
                  {title && (
                    <h3
                      className={cn(
                        "text-xs font-medium leading-none",
                        titleColor[variant],
                        highlightTitle && titleColor["success"] // override for meeting case
                      )}
                    >
                      {title}
                    </h3>
                  )}
                  <p className="text-xs text-muted-foreground">{message}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {actions?.label && (
                  <Button
                    variant={actions.variant || "outline"}
                    size="sm"
                    onClick={() => {
                      actions.onClick();
                      sonnerToast.dismiss(toastId);
                    }}
                    className={cn(
                      "cursor-pointer",
                      variant === "success"
                        ? "text-green-600 border-green-600 hover:bg-green-600/10 dark:hover:bg-green-400/20"
                        : variant === "error"
                        ? "text-destructive border-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20"
                        : variant === "warning"
                        ? "text-amber-600 border-amber-600 hover:bg-amber-600/10 dark:hover:bg-amber-400/20"
                        : "text-foreground border-border hover:bg-muted/10 dark:hover:bg-muted/20"
                    )}
                  >
                    {actions.label}
                  </Button>
                )}

                <button
                  onClick={() => {
                    sonnerToast.dismiss(toastId);
                    onDismiss?.();
                  }}
                  className="rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Dismiss notification"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            </div>
          </motion.div>
        ),
        { duration, position }
      );
    },
  }));

  return <SonnerToaster position={defaultPosition} toastOptions={{ unstyled: true, className: "flex justify-end" }} />;
});

export default Toaster;
