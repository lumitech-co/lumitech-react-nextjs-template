interface ICheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Checkbox = ({ checked, onChange, disabled }: ICheckboxProps) => (
  <span
    className={`checkbox${checked ? 'checked' : ''}`}
    aria-label={checked ? 'Checked' : 'Unchecked'}
    onClick={() => {
      if (!disabled) {
        onChange(!checked);
      }
    }}
    role="checkbox"
    aria-checked={checked}
    tabIndex={0}
    onKeyDown={event => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        if (!disabled) {
          onChange(!checked);
        }
      }
    }}
  >
    <svg
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="2 7 6 11 12 3" />
    </svg>
  </span>
);
