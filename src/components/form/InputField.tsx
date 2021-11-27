import { useBlocks, useForms } from "store";
import { findOutByBlock } from "components/blocks/helpers/blocks"

interface Props {
  attrs: any;
}
const InputField: React.FC<Props> = ({ attrs }) => {
  const blocks = useBlocks((state) => state.blocks);
  const updateForm = useForms((state) => state.updateForm);
  const ref = findOutByBlock(blocks, attrs.id, 'form/Form').attrs.refname

  return (
    <div className="">
      {attrs.label ? (
        <label className="text-gray-700 text-xs">{attrs.label}</label>
      ) : null}
      <input
        placeholder={attrs.placeholder}
        className="bg-white p-3 rounded-sm w-full text-gray-500 text-sm border mt-1"
        type={attrs.type || "text"}
        onChange={(e)=>{ 
          updateForm({ref:ref, path:attrs.outputValue, data:e.target.value}) 
        }}
      />
    </div>
  );
};
export default InputField;
