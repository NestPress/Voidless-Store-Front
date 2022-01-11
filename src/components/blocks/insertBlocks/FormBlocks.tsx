/* TODO fix type */
// @ts-ignore
// @ts-nocheck
import { useMutation } from '@apollo/client';
import { FiClipboard, FiList, FiHash, FiSave } from "react-icons/fi";
import { v4 as uuidv4 } from 'uuid';
import { getFromStore, useApp, pushToStore, useBlocks } from "store";
import { CREATE_BLOCK } from "components/blocks/gql/composer"

interface Props {
  type: string;
}

export const FormBlocks: React.FC = ({type}) => {
  
  const targeter = useApp((state) => state.custom.activeTargeter);
  const blocks = getFromStore({store:"display", ref:"blocks" });
  
  /* local consts */
  const r = getFromStore({store:"router",ref:"slugPath"})
  const prefix = {
    id: uuidv4(),
    post: r[1],
    order: parseInt(blocks[blocks.length - 1].order) + 1,
    parentId: type === "next" 
      ? targeter?.parentId === 0 ? "0" : targeter?.parentId 
      : targeter?.id,
  };

  const buttonClass =
    "text-sm bg-blue-500 w-full p-2 rounded mt-1 text-white hover:bg-blue-800 flex items-center";  
 
    /* mutation */
    const [addNewBlock, { data, loading, error }] = useMutation(CREATE_BLOCK, {
      onCompleted(data) {
          
          const payload = Object.assign({},data.createBlock) 
          payload.parentId === "0" ? payload.parentId = 0 : null
          pushToStore({store:"display", ref:`blocks`, data:payload})
      
          useApp.setState({ custom: { activeTargeter:payload }})
          useBlocks.setState({ panel: "block", composerTab: null });

      }, 
      update: (cache) => {
        cache.evict({ id: "ROOT_QUERY", fieldName: "getBlocks" });
      },
    });
    const teachSetBlock = (block) => {
      /* Set to zustand state */
      addNewBlock({ variables: {input:block}});
    }
  
  return (
    <div className="px-2">
      <button
        className={buttonClass}
        onClick={(e) =>
          teachSetBlock({
            ...prefix,
            block: "form/Form",
            attrs: {
              mutation: "",
              refName: prefix.id,
              consts:{},
              successActions:{},
              errorActions:{},
              classes: ""
            },
          })
        }
      >
        <FiClipboard/><span className="ml-2">Form component</span>
      </button>

      <button
        className={buttonClass}
        onClick={(e) =>
          teachSetBlock({
            ...prefix,
            block: "form/InputField",
            attrs: {
              label: "Example label",
              placeholder: "Example placeholder",
              default: "",
              outputValue: "data.input_value",
              classes: ""
            },
          })
        }
      >
        <FiHash/><span className="ml-2">Input field</span>
      </button>

      <button
        className={buttonClass}
        onClick={(e) =>
          teachSetBlock({
            ...prefix,
            block: "form/TextareaField",
            attrs: {
              rows: 6,
              label: "Example label",
              placeholder: "Example placeholder",
              default: "",
              outputValue: "data.textarea_value",
              classes: ""
            },
          })
        }
      >
        <FiHash/><span className="ml-2">Textarea field</span>
        
      </button>

      <button
        className={buttonClass}
        onClick={(e) =>
          teachSetBlock({
            ...prefix,
            block: "form/SelectField",
            attrs: {
              label: "Example label",
              outputValue: "data.select_value",
              placeholder: "Example placeholder",
              options:[],
              classes: ""
            },
          })
        }
      >
        <FiList/><span className="ml-2"> Select and search field</span>
      </button>

      <button
        className={buttonClass}
        onClick={(e) =>
          teachSetBlock({
            ...prefix,
            block: "form/KeyValueField",
            attrs: {
              placeholder1: "Insert key",
              placeholder2: "Insert value",
              submit: "Insert",
              label: "Example label",
              outputValue: "data.keys_value",
              classes: ""
            },
          })
        }
      >
        <FiList/><span className="ml-2"> Key and value field</span>
      </button>

      <button
        className={buttonClass}
        onClick={(e) =>
          teachSetBlock({
            ...prefix,
            block: "form/SwithField",
            attrs: {
              label: "Example label",
              outputValue: "data.swith_value",
              classes: ""
            },
          })
        }
      >
        <FiList/><span className="ml-2">Swith field</span>
      </button>

      <button
        className={buttonClass}
        onClick={(e) =>
          teachSetBlock({
            ...prefix,
            block: "form/SubmitButton",
            attrs: {
              title: "Submit button",
              classes: ""
            },
          })
        }
      >
        <FiSave/><span className="ml-2"> Submit button</span>
      </button>


    </div>
  );
};
