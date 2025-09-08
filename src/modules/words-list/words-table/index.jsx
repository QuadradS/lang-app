import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import {wordStatuses} from "../../../store/main.jsx";
import {Tag} from "primereact/tag";
import classNames from "classnames";
import {InputTextarea} from "primereact/inputtextarea";
import {Dropdown} from "primereact/dropdown";

export const WordsTable = ({words, onUpdateWord}) => {


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

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)}/>;
  };

  const textAreaEditor = (options) => {
    return <InputTextarea type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)}/>;
  };

  const getSeverity = (v) => {
    return classNames({
      'danger': v === wordStatuses.unlearned,
      'success': v === wordStatuses.learned,
      'warning': v === wordStatuses.inProgress,
    })
  }

  const statusEditor = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        optionLabel="name"
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Select a Status"
        itemTemplate={(option) => {
          return <Tag value={option.name} severity={getSeverity(option.code)}></Tag>;
        }}
      />
    );
  };

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

  const textBody = ({example}) => {
    if(example?.length > 20) {
      return `${example?.slice(0,20)} ...`
    }
    return example
  }

  const onRowEditComplete = (e) => {
    onUpdateWord({
      ...e.newData
    })
  }

  return (
    <DataTable sortOrder={-1} stripedRows emptyMessage={"List is empty"} value={words} editMode="row" dataKey="id"
               onRowEditComplete={onRowEditComplete} tableStyle={{minWidth: '50rem'}}>
      <Column sortable field="word" header="Word" editor={(options) => textEditor(options)} style={{width: '20%'}}/>
      <Column sortable field="wordTranslate" header="Word translate" editor={(options) => textEditor(options)}
              style={{width: '20%'}}/>
      <Column sortable field="example" body={textBody} header="Word example" editor={(options) => textAreaEditor(options)}
              style={{width: '20%'}}/>
      <Column sortable field="status" header="Status" body={statusBodyTemplate} editor={(options) => statusEditor(options)}
              style={{width: '20%'}}></Column>
      <Column rowEditor headerStyle={{width: '10%', minWidth: '8rem'}} bodyStyle={{textAlign: 'center'}}></Column>
    </DataTable>
  )
}
