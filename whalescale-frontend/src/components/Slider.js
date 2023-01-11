import React, {useState, useEffect, useRef} from 'react'

const getWidth = () => window.innerWidth;
const getHeight = () => window.innerHeight;

const Slider = props => {
    const { UserImg } = props

    const Img1 = UserImg[0]    
    const Img2 = UserImg[1]
    const ImgLast = UserImg[UserImg.length - 1]
    /* What if I want to slide through images? */

    const [state, setState] = useState ({
        activeImg: 0,
        translate: getWidth(),
        transition: 0.45,
        _imgs: [ImgLast, Img1, Img2]
    })

    const { activeImg, translate, _imgs, transition} = state


    const retLoopImages = () => {
        let _imgs = []

        if (activeImg == UserImg.length - 1)
        _imgs = [UserImg[UserImg.length - 2], ImgLast, Img1]
        
        else if (aciveImg === 0) _imgs = [ImgLast, Img1, Img2]

        else _imgs = UserImg.slice(activeImg - 1, activeImg + 2)
    }

    const nextImg = () =>
        setState ({
            ...state,
            translate: translate + getWidth(),
            activeImg: activeImg === UserImg.length - 1 ? 0 : activeImg + 1
        })

    const prevImg = () =>
        setState ({
            ...state,
            translate: 0,
            activeImg: activeImg === 0 ? UserImg.length - 1 : activeImg - 1
        })

        return (
            <div className = 'Slider'>
                <SliderContent
                    translate = {translate}
                    transition = {transition}
                    width = {getWidth() * _imgs.length}>
                    {_imgs.map((_img, i) => (
                        <Slide width = {getWidth()} key = {_slide + i} content = {slide} />
                    ))}
                </SliderContent>

                <Arrow direction = 'left' handleClick={prevImg} />
                <Arrow direction = 'right' handleClick= {nextImg} />

                <Dots imgs={UserImg} activeImg={activeImg}/>
                 </div>
        )

}


export default Slider
