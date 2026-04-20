
const Trending = () => {
  return (
    <div className=' flex justify-between items-center max-w-full '>

      <div className="m-2 text-start shadow-sm ">
        <img src="../../../public/image/tea.jpg" alt="product" className="w-[270px] h-[270px] object-cover" />
        <h3 className="text-gray-500">Product Name</h3>
        <p className="text-lg">£60.00</p>
      </div>
      <div className="m-2 text-start shadow-sm">
        <img src="../../../public/image/tea.jpg" alt="product" className="w-[270px] h-[270px] object-cover" />
        <h3 className="text-gray-500">Product Name</h3>
        <p className="text-lg">£60.00</p>
      </div>
      <div className="m-2 text-start relative shadow-sm">
        <img src="../../../public/image/tea.jpg" alt="product" className="w-[270px] h-[270px] object-cover" />
        <h3 className="text-gray-500">Product Name</h3>
        <p className="text-lg">£60.00</p>
        <span className="bg-orange-500 px-2 text-white top-4 left-4 absolute">-7%</span>
      </div>
      <div className="m-2 text-start shadow-sm ">
        <img src="../../../public/image/tea.jpg" alt="product" className="w-[270px] h-[270px] object-cover" />
        <h3 className="text-gray-500">Product Name</h3>
        <p className="text-lg">£60.00</p>
      </div>
    </div>
  )
}

export default Trending