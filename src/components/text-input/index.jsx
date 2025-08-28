export const TextInput = ({label, ...props}) => {
  return (
    <label className="w-full">
      <span className="text-sm">label</span>
      <input {...props} className="w-full p-2 text-[18px] rounded border-[1px] border-[#0035f6] text-[#0035f6]"/>
    </label>
  )
}
