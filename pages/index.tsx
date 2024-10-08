import HomeLayout from '../components/HomeLayout/HomeLayout'

const HomePage = () => {
  return (
    <HomeLayout>
      <div className="w-100p h-100p layout justify-center align-center">
        <div className="w-300">
          <div>
            <img className="w-100p" src="/logo-monfent.png" />
          </div>
          <p>
            Completely <b>FREE.</b>
          </p>
        </div>
      </div>
    </HomeLayout>
  )
}
export default HomePage
