export function Button({
  variant = "default",
  size = "md",
  className = "",
  children,
  isLoading = false,
  leadingIcon = null,
  trailingIcon = null,
  as: Component = "button",
  type = "button",
  href,
  ariaLabel,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline:
      "border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
    ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  };
  const sizes = { sm: "h-8 px-3 text-sm", md: "h-9 px-4 text-sm", lg: "h-10 px-6 text-base" };
  const cls = `${base} ${variants[variant] || ""} ${sizes[size] || ""} ${className}`;

  return (
    <Component
      className={cls}
      type={Component === "button" ? type : undefined}
      href={Component === "a" ? href : undefined}
      aria-busy={isLoading || undefined}
      aria-label={ariaLabel}
      {...props}
    >
      {leadingIcon ? (
        <span className="mr-2" aria-hidden>
          {leadingIcon}
        </span>
      ) : null}
      <span className="inline-flex items-center gap-2">
        {isLoading && (
          <span
            className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin"
            aria-hidden
          />
        )}
        {children}
      </span>
      {trailingIcon ? (
        <span className="ml-2" aria-hidden>
          {trailingIcon}
        </span>
      ) : null}
    </Component>
  );
}
