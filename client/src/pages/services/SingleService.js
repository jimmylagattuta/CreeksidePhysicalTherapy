import { useParams } from 'react-router-dom';
import { services } from '../../data';
import Error from '../Error';

const SingleService = () => {
    const { serviceId } = useParams();
    const Service = services.find(
        (product) =>
            product.name.toLowerCase().split(' ').join('-') ===
            serviceId.toLowerCase()
    );

    if (!Service) {
        return <Error />;
    }
    return (
        <div className='page-container'>
            <div className='page-top-header'>
                <div className='page-image-container'>
                    <img
                        src={Service.image}
                        alt={Service.name}
                        className='page-image'
                    />
                </div>
                <div className='page-info'>
                    <h2 className='page-title'>{Service.firstTitle}</h2>
                    {Service.description.map((item, index) => (
                        <p key={index} className='page-description'>{item}</p>
                    ))}
                </div>
            </div>

            {Service.secondTitle && (
                <div className='popout-content'>
                    <div className='page-info'>
                        <h2 className='page-title'>{Service.secondTitle}</h2>
                        {Service.descriptionTwo.map((item, index) => (
                            <p key={index} className='page-description'>{item}</p>
                        ))}
                    </div>
                </div>
            )}

            {Service.descriptionTwo && (
                <div className='popout-content'>
                    <div className='page-info'>
                        {Service.descriptionTwo.map((item, index) => (
                            <p key={index} className='page-description'>{item}</p>
                        ))}
                    </div>
                </div>
            )}

            {Service.secondTitleBulletedList && (
                <div className='popout-content'>
                    <div className='page-info'>
                        <ul className='bulleted-list'>
                            {Service.secondTitleBulletedList.map((item, index) => (
                                <li key={index} className='page-description'>
                                    <b>{item.split(':')[0]}:</b> {item.split(':')[1]}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {Service.descriptionAfterSecondBulletedList && (
                <div className='popout-content'>
                    {Service.descriptionAfterSecondBulletedList.map((item, index) => (
                        <p key={index} className='page-description'>{item}</p>
                    ))}
                </div>
            )}

            {Service.thirdTitle && (
                <div className='popout-content'>
                    <div className='page-info'>
                        <h2 className='page-title'>{Service.thirdTitle}</h2>
                        {Service.descriptionThree.map((item, index) => (
                            <p key={index} className='page-description'>{item}</p>
                        ))}
                    </div>
                </div>
            )}

            {Service.descriptionThree && (
                <div className='popout-content'>
                    <div className='page-info'>
                        {Service.descriptionThree.map((item, index) => (
                            <p key={index} className='page-description'>{item}</p>
                        ))}
                    </div>
                </div>
            )}

            {Service.thirdTitleBulletedList && (
                <div className='popout-content'>
                    <div className='page-info'>
                        <ul className='bulleted-list column-list'>
                            {Service.thirdTitleBulletedList.map((item, index) => (
                                <li key={index} className='page-description'>
                                    <b>{item.split(':')[0]}:</b> {item.split(':')[1]}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {Service.descriptionAfterThirdBulletedList && (
                <div className='popout-content'>
                    {Service.descriptionAfterThirdBulletedList.map((item, index) => (
                        <p key={index} className='page-description'>{item}</p>
                    ))}
                </div>
            )}

            {Service.fourthTitle && (
                <div className='popout-content'>
                    <div className='page-info'>
                        <h2 className='page-title'>{Service.fourthTitle}</h2>
                        {Service.descriptionFour.map((item, index) => (
                            <p key={index} className='page-description'>{item}</p>
                        ))}
                    </div>
                </div>
            )}

            {Service.fourthTitleBulletedList && (
                <div className='popout-content'>
                    <div className='page-info'>
                        <ul className='bulleted-list'>
                            {Service.fourthTitleBulletedList.map((item, index) => (
                                <li key={index} className='page-description'>
                                    <b>{item.split(':')[0]}:</b> {item.split(':')[1]}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            
            {Service.descriptionAfterFourthBulletedList && (
                <div className='popout-content'>
                    {Service.descriptionAfterFourthBulletedList.map((item, index) => (
                        <p key={index} className='page-description'>{item}</p>
                    ))}
                </div>
            )}

            {Service.fifthTitle && (
                <div className='popout-content'>
                    <div className='page-info'>
                        <h2 className='page-title'>{Service.fifthTitle}</h2>
                        {Service.descriptionFive.map((item, index) => (
                            <p key={index} className='page-description'>{item}</p>
                        ))}
                    </div>
                </div>
            )}

            {Service.sixthTitle && (
                <div className='popout-content'>
                    <div className='page-info'>
                        <h2 className='page-title'>{Service.sixthTitle}</h2>
                        {Service.descriptionSix.map((item, index) => (
                            <p key={index} className='page-description'>{item}</p>
                        ))}
                    </div>
                </div>
            )}

            {Service.seventhTitle && (
                <div className='popout-content'>
                    <div className='page-info'>
                        <h2 className='page-title'>{Service.seventhTitle}</h2>
                        {Service.descriptionSeven.map((item, index) => (
                            <p key={index} className='page-description'>{item}</p>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default SingleService;
