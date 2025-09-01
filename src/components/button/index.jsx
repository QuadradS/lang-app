export const Button = ({fullWidth, ...props} ) => {

  let classnames = "px-6 py-2 rounded border-[1px] border-[#0035f6] text-[#0035f6] active:opacity-[80%] disabled:border-[#dcdcdc] disabled:text-[#393939]"

  if(fullWidth) {
    classnames = `${classnames} w-full`
  }

  return (
    <button {...props} className={classnames}/>
  )
}
