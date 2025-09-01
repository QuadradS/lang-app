export const Button = ({fullWidth, ...props} ) => {


  const padding = 'lg:px-4 lg:py-q px-3 py-1'
  const font = 'text-[#0035f6] disabled:text-[#393939] text-sm lg:text-md'

  let classnames = `${padding} ${font} rounded border-[1px] border-[#0035f6] active:opacity-[80%] disabled:border-[#dcdcdc] `

  if(fullWidth) {
    classnames = `${classnames} w-full`
  }

  return (
    <button {...props} className={classnames}/>
  )
}
