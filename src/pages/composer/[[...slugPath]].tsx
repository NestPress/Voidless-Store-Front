/* TODO fix type */
// @ts-ignore
// @ts-nocheck
import { FiFile, FiGitPullRequest, FiChevronLeft } from "react-icons/fi";

import { EditMapper, Composer } from "components/blocks"
import { prepareBlocks } from "helpers"
import { useQuery } from '@apollo/client'
import { GET_BLOCKS } from "components/nestpress"
import { useRouter } from "next/router"
import { useEffect } from "react";
import { useApp, useBlocks, getFromStore, setToStore } from "store";

const ComposerPage: React.FC = () => {

  const selectedBlockId = useBlocks((state) => state.selectedBlockId);
  const blocksPocket = useBlocks((state) => state.blocksPocket);
  const copiedBlocks = useBlocks((state) => state.copiedBlocks);
  const composerTab = useBlocks((state) => state.composerTab);
  const addBlock = useBlocks((state) => state.addBlock);
  const preview = useBlocks((state) => state.preview);

  const router = useRouter();
  const rMix = Object.assign({}, getFromStore({store:"router"}), router.query)
  const layout = `${rMix.slugPath[0].toLowerCase()}-layout`
  useApp.setState({ router: rMix })

  // routing event use to change app data by routing way
  useEffect(() => {
    // setToStore({store:"custom",ref:`activeTargeter`, data:true})
    // console.log('router change', getFromStore({store:"custom"}))
  }, [router.asPath]);  

  useBlocks.setState({ preview: true })
  

  const blocks = useApp((state) => state.display.blocks) || [];
  const { loading, error, data, refetch } = useQuery(GET_BLOCKS,{
    variables: { 
      sort:{ order:"asc" },
      filter:{
        post:{
          in: [ rMix.slugPath[1], layout, 'below-footer-layout']
        }
      }
    },
    onCompleted({getBlocks : { list }} = data) {
      list?.length && useApp.setState({ display: { blocks:prepareBlocks(list, rMix.slugPath) }}) 
    },
    optimisticResponse(){
        useApp.setState({ display: {blocks: []}});
      }
  });

  return <div>

    <div className="font-bold text-base text-gray-500 border-b border-gray-300 bg-white mb-0.5 flex items-center">
      <div
        onClick={e=>useBlocks.setState({ blocksPocket: !blocksPocket })} 
        className="border-r p-3.5  hover:bg-gray-100 cursor-pointer">
        {blocksPocket ? <FiChevronLeft/> : <FiGitPullRequest/>}
      </div>
      <div onClick={e=>{
          useApp.setState({ custom: { activeTargeter:false }})
          // useBlocks.setState({ preview: false });
          router.push(`/${rMix.slugPath[0]}/${rMix.slugPath[1]}`)
        }} className="flex flex-1 items-center hover:bg-gray-100 p-2.5 cursor-pointer ">
        <FiFile/>
        <div key={router.asPath} className="ml-1 flex-1">{rMix.slugPath[1]}</div>
        <div className="flex items-center text-xs font-normal text-blue-400"><FiChevronLeft/><span>Back to page view</span></div>
      </div>
    </div>


    <div style={{zIndex:2000}}><Composer /></div>
    <div style={{marginRight:'330px', marginLeft:"10px", marginTop:"10px"}}>
      { blocks.length > 0 && <EditMapper blocks={blocks} /> }
    </div>
    </div>
};
export default ComposerPage;