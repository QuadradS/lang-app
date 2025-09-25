import {MainLayout} from "../../components/layout/main-layout.jsx";
import {Card} from "primereact/card";
import {CreateGroupModal} from "./create-group-modal/index.jsx";
import {useStore} from "../../store/main.jsx";
import {Link} from "react-router";


export const LearnModule = () => {

  const {data} = useStore()
  console.log(data)

  return (
    <MainLayout>
      <div className="relative pt-2 w-full">
        <h2 className="text-xl">Choose a group</h2>

        <CreateGroupModal/>

        <div className="mx-[-5px] mt-3">
          <div className="flex flex-wrap">
            {Object.values(data.groups).map(({name, id}) => (
              <Link to={`/words/${id}`} key={id} className="p-[5px] lg:w-[20%] w-[50%]">
                <Card
                  className="cursor-pointer active:opacity-[80%]"
                  title={`${name.slice(0,13)}${name.length > 13 ? '...' : ''}`}
                  // subTitle={"Some more info about the group".slice(0, 40)}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
