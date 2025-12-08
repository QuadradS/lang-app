import {MainLayout} from "../../components/layout/main-layout.jsx";
import {Card} from "primereact/card";
import {CreateGroupModal} from "./create-group-modal/index.jsx";
import {useStore} from "../../store/main.jsx";
import {Link} from "react-router";
import {Button} from "primereact/button";
import {useState} from "react";


export const LearnModule = () => {
  const [selectedGroup, setSelectedGroup] = useState(null)
  const {data} = useStore()

  console.log('selectedGroup ', selectedGroup)

  return (
    <MainLayout>
      <div className="relative pt-2 w-full">
        <h2 className="text-xl">Choose a group</h2>

        <CreateGroupModal groupId={selectedGroup} onClose={() => setSelectedGroup(null)}/>

        <div className="mx-[-5px] mt-3">
          <div className="flex flex-wrap">
            {Object.values(data.groups).map(({name, id}) => (
              <Card className="lg:w-[18%] w-[48%] mr-[1%]" id={id}>
                <Link to={`/words/${id}`} key={id} className="text-xl no-underline p-[5px]">{name}</Link>
                <div className="flex justify-between">
                  <Button className="w-[48%]" size="small" severity="info" onClick={() => setSelectedGroup(id)}>Edit</Button>
                  <Button className="w-[48%]" size="small" severity="danger">Remove</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
