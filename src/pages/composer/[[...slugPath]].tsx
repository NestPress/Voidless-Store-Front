/* TODO fix type */
// @ts-ignore
// @ts-nocheck
import { FiFile, FiGitPullRequest, FiChevronLeft } from "react-icons/fi";
import { Composer, Tree, BlocksPocket } from "components/blocks";
import { useBlocks, useForms } from "store";
import { useRouter } from "next/router";
import { useEffect , useRef } from "react";
import { getNestedChildren } from 'components/blocks/helpers/blocks'
import { gql, useQuery, useMutation} from '@apollo/client';
import { GET_BLOCKS } from "components/blocks/gql/composer"


const ComposerPage: React.FC = () => {

  const selectedBlockId = useBlocks((state) => state.selectedBlockId);
  const blocksPocket = useBlocks((state) => state.blocksPocket);
  const copiedBlocks = useBlocks((state) => state.copiedBlocks);
  const composerTab = useBlocks((state) => state.composerTab);
  
  const router = useRouter();
  const slugPath = router.query?.slugPath || ["Page","home"];
  const blocks = useBlocks((state) => state.blocks) || [];
  const addBlock = useBlocks((state) => state.addBlock);
  
  /* workaround sollution to indexing childrens with queryList blocks */
  /* TODO - better method is copying blocks  */
  const queryIndex = []

  useForms.setState({ pageData: {slugPath : slugPath} })


  const keysHandler = (e) => { 
      
      const key = e.which || e.keyCode, ctrl = e.ctrlKey ? e.ctrlKey : ((key === 17)
          ? true : false);
      if (key == 86 && ctrl) { // V
          // if(selectedBlockId){
          //   const text = JSON.stringify(copiedBlocks)
          //   copiedBlocks.map(el=>{
          //     text = text.replaceAll(el.id, uuidv4())
          //   })
          //   const toPaste = JSON.parse(text);
          //   toPaste[0].parentId = selectedBlockId;
          //   toPaste.map( (el) => { addBlock(el) } )
          // }
      }
      else if (key == 67 && ctrl) { // C
        const parsedEls = getNestedChildren(blocks, selectedBlockId, true) 
        useBlocks.setState({ copiedBlocks: parsedEls })
    }
  }

  const { loading, error, data, refetch } = useQuery(GET_BLOCKS,{
    variables: { 
      sort:{order:"asc"},
      filter:{
        post:{
          eq:slugPath[1]
        }
      }
    },
    onCompleted(data) {
      data.getBlocks.list.length 
      ? useBlocks.setState({ 
          blocks: data.getBlocks.list.map(el => el.parentId === "0" ? {...el, parentId:0} : el) 
        })
      : console.log('create content with pagepanel')
    }
  });
  
  return (
    (
      <div tabIndex="0" onKeyDown={keysHandler}>
        {blocksPocket && <BlocksPocket />}
        <div style={{ marginRight: "20rem", marginLeft: blocksPocket ? "15rem" : null }}>
          <div className="font-bold text-base text-gray-500 border-b border-gray-300 bg-white mb-0.5 flex items-center">
            <div
              onClick={e=>useBlocks.setState({ blocksPocket: !blocksPocket })} 
              className="border-r p-3.5  hover:bg-gray-100 cursor-pointer">
              {blocksPocket ? <FiChevronLeft/> : <FiGitPullRequest/>}
            </div>
            <div onClick={e=>router.push(`/${slugPath[0]}/${slugPath[1]}`)} className="flex flex-1 items-center hover:bg-gray-100 p-2.5 cursor-pointer ">
              <FiFile/>
              <div key={router.asPath} className="ml-1 flex-1">{slugPath[1]}</div>
            </div>
          </div>
          <div className="pr-px">
            { blocks.length > 0 && slugPath.length > 1 ? <Tree blocks={blocks} queryIndex={queryIndex} /> : null }
          </div>
        </div>
        <Composer />

        {!slugPath[1] && 
          <div className="fixed border shadow" style={{left:'20%', top:'20%', width:'calc(70% - 420px)'}}>
            <div className="border-b p-2 bg-pink-500 text-white">
              {!slugPath[1] && `Post (${slugPath[0]}) is not selected`}
            </div>
            <div className="p-2 pb-3">
             {!slugPath[1] && 
              <>
                <span>Select {slugPath[0]} post</span>  
                {composerTab !== 'pages' && <span> on <span onClick={e=>useBlocks.setState({ composerTab: "pages", panel:'mainPanel'})} className="text-blue-600 cursor-pointer hover:underline">posts list menu</span></span> } 
                <span> or registered new</span>
              </>
            }
            </div>
          </div>
        }
      </div>
    ) 
  );
};
export default ComposerPage;