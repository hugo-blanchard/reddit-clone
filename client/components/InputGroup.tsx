import classNames from "classnames";

interface InputGroupProps {
  type: string;
  placeholder: string;
  value: string;
  error: string | undefined;
  setValue: (str: string) => void;
}

const InputGroup: React.FC<InputGroupProps> = ({ placeholder, value, error, setValue, type }) => {
  return (
    <>
      <input
        type={type}
        className={classNames(
          "w-full px-3 py-2 transition bg-gray-200 border border-gray-400 rounded outline-none hover:bg-gray-50 focus:bg-gray-50",
          { "border-red-600": error }
        )}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <small className="font-medium text-red-600">{error}</small>
    </>
  );
};

export default InputGroup;
