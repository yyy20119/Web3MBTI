// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


contract Web3MBTI {
    mapping(address => uint8) public mbtiResults;

    string[16] private mbtiTypes = [
        "ISTJ", "ISFJ", "INFJ", "INTJ",
        "ISTP", "ISFP", "INFP", "INTP",
        "ESTP", "ESFP", "ENFP", "ENTP",
        "ESTJ", "ESFJ", "ENFJ", "ENTJ"
    ];

    event MBTIResultUpdated(address indexed owner, uint8 mbtiType);

    modifier validMBTIType(uint8 _mbtiType) {
        require(_mbtiType >= 1 && _mbtiType <= 16, "invalid type");
        _;
    }


    function updateMBTIResult(uint8 _mbtiType) validMBTIType(_mbtiType) public {
        mbtiResults[msg.sender] = _mbtiType;
        emit MBTIResultUpdated(msg.sender, _mbtiType);
    }

    function getMBTIResult(address _userAddress) public view returns (uint8 mbtiType) {
        return mbtiResults[_userAddress];
    }

    function getMBTIType(uint8 _mbtiType) public validMBTIType(_mbtiType) view returns (string memory) {
        return mbtiTypes[_mbtiType - 1];
    }
}
