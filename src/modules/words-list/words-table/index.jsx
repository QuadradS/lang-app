import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {wordStatuses} from "../../../store/main.jsx";
import {Tag} from "primereact/tag";
import classNames from "classnames";
import {Button} from "primereact/button";

export const WordsTable = ({words, onSelectWord}) => {
  const statuses = [
    {
      name: 'Unlearned',
      code: wordStatuses.unlearned,
      value: wordStatuses.unlearned,
    },
    {
      name: 'In progress',
      code: wordStatuses.inProgress,
      value: wordStatuses.inProgress,
    },
    {
      name: 'Learned',
      code: wordStatuses.learned,
      value: wordStatuses.learned,
    }
  ]

  const getSeverity = (v) => {
    return classNames({
      'danger': v === wordStatuses.unlearned,
      'success': v === wordStatuses.learned,
      'warning': v === wordStatuses.inProgress,
    })
  }

  const getValue = (v) => {
    return classNames({
      'Unleaned': v === wordStatuses.unlearned,
      'Learned': v === wordStatuses.learned,
      'In progress': v === wordStatuses.inProgress,
    })
  }

  const statusBodyTemplate = ({status}) => {
    return <Tag value={getValue(status)} severity={getSeverity(status)}></Tag>;
  }

  const editBody = ({id}) => {
    return (
      <div className='flex justify-between'>
        <Button onClick={() => onSelectWord(id)} icon="pi pi-pencil" rounded outlined severity="secondary" aria-label="Bookmark" />
        <Button icon="pi pi-times" rounded outlined severity="danger" aria-label="Cancel" />
      </div>
    );
  };


  return (
    <DataTable sortOrder={-1} stripedRows emptyMessage={"List is empty"} value={words} dataKey="id"
               tableStyle={{minWidth: '50rem'}}>
      <Column sortable field="word" header="Word" style={{width: '20%'}}/>
      <Column sortable field="wordTranslate" header="Word translate" style={{width: '20%'}}/>
      <Column sortable field="status" header="Status" body={statusBodyTemplate} style={{width: '20%'}}></Column>
      <Column headerStyle={{width: '10%', minWidth: '8rem'}} bodyStyle={{textAlign: 'center'}}/>
      <Column headerStyle={{width: '10%', minWidth: '8rem'}} bodyStyle={{textAlign: 'center'}} body={editBody}>
      </Column>
    </DataTable>
  )
}
