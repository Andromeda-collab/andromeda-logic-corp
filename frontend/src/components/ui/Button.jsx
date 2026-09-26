// Button — Primary (gradient fill) / Secondary (outline) / Ghost. Section 7.8.
export default function Button({ variant = "primary", as: Component = "button", children, ...props }) {
  return (
    <Component className={`alc-button alc-button--${variant}`} {...props}>
      {children}
    </Component>
  );
}