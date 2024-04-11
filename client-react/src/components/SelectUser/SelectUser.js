import React, { useState } from 'react';
import ENV from '../../CONFIG';
import './SelectUser.css';


const { PROFILE_ID_1, CLIENT_ID_1, REFRESH_TOKEN_1 } = ENV
const { PROFILE_ID_2, CLIENT_ID_2, REFRESH_TOKEN_2 } = ENV
const { PROFILE_ID_3, CLIENT_ID_3, REFRESH_TOKEN_3 } = ENV
const { PROFILE_ID_4, CLIENT_ID_4, REFRESH_TOKEN_4 } = ENV
const { PROFILE_ID_5, CLIENT_ID_5, REFRESH_TOKEN_5 } = ENV
console.log("PFAFLK", PROFILE_ID_1);

function SelectUser() {
    // Khai báo state để lưu giá trị được chọn
    const [selectedValue, setSelectedValue] = useState({
        profileId: '',
        clientId: '',
        refreshToken: ''
    });

    // Xử lý sự kiện khi thay đổi giá trị trong SelectUser
    const handleChange = (event) => {
        setSelectedValue(JSON.parse(event.target.value));
    };

    // Xử lý sự kiện khi nhấn nút submit
    const handleSubmit = () => {
        // Kiểm tra xem giá trị đã được chọn hay chưa
        if (selectedValue) {

            // Lưu giá trị đã chọn vào session storage
            sessionStorage.setItem('clientId', selectedValue.clientId);
            sessionStorage.setItem('profileId', selectedValue.profileId);
            sessionStorage.setItem('refreshToken', selectedValue.refreshToken);
            window.location.reload()
        } else {
            alert('Vui lòng chọn một giá trị');
        }
    };

    return (
        <div className="selectUser">
            {/* Combobox */}
            <select className="selectUser__select" value={JSON.stringify(selectedValue)} onChange={handleChange}>
                <option className="selectUser__option" value={JSON.stringify({
                    profileId: PROFILE_ID_1,
                    clientId: CLIENT_ID_1,
                    refreshToken: REFRESH_TOKEN_1
                })}>USER 1</option>
                <option className="selectUser__option" value={JSON.stringify({
                    profileId: PROFILE_ID_2,
                    clientId: CLIENT_ID_2,
                    refreshToken: REFRESH_TOKEN_2
                })}>USER 2</option>
                <option className="selectUser__option" value={JSON.stringify({
                    profileId: PROFILE_ID_3,
                    clientId: CLIENT_ID_3,
                    refreshToken: REFRESH_TOKEN_3
                })}>USER 3</option>
                <option className="selectUser__option" value={JSON.stringify({
                    profileId: PROFILE_ID_4,
                    clientId: CLIENT_ID_4,
                    refreshToken: REFRESH_TOKEN_4
                })}>USER 4</option>
                <option className="selectUser__option" value={JSON.stringify({
                    profileId: PROFILE_ID_5,
                    clientId: CLIENT_ID_5,
                    authorization: REFRESH_TOKEN_5
                })}>USER 5</option>
            </select>

            {/* Nút submit */}
            <button className="selectUser__button" onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default SelectUser;
