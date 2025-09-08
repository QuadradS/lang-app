import "./index.css"

export const Popover = ({popoverText, ...props}) => {
  return (
    <div className="popoverWrap">
      <span className="popover">{popoverText}</span>
      <div {...props}/>
    </div>
  )
}
