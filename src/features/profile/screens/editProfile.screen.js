import React, { useContext, useState } from "react";
import styled from "styled-components/native";
import { Text } from "../../../components/typography/text.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import { ScrollView } from "react-native";
import camera from "../../../../assets/camera";
import { TextInputView } from "../../../components/utility/text-input.component";
import IoncIcon from "react-native-vector-icons/Ionicons";
import {
  Container,
  Body,
  AddImageContainer,
  ImageView,
  CameraIcon,
  FormContainer,
  InputContainer,
  LabelText,
} from "../../auth/components/addProfile.style";
import { NewsContext } from "../../../services/news/news.context";
import { Pressable } from "react-native";
import firebase from "firebase/compat";

const Row = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const EditProfileScreen = ({ navigation }) => {
  const { infoUser, setInfoUser } = useContext(NewsContext);
  const [avatar, setAvatar] = useState(infoUser.avatar);
  const [username, setUsername] = useState(infoUser.username);
  const [fullname, setFullname] = useState(infoUser.fullname);
  const [phone, setPhone] = useState(infoUser.phone);
  const [address, setAddress] = useState(infoUser.address);

  const handleEditProfile = () => {
    setInfoUser({
      ...infoUser,
      avatar: avatar,
      username: username,
      fullname: fullname,
      phone: phone,
      address: address,
    });

    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        avatar: avatar,
        username: username,
        fullname: fullname,
        phone: phone,
        address: address,
      });

    navigation.goBack();
  };

  return (
    <Container>
      <ScrollView>
        <Container>
          <Body>
            <Row>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <IoncIcon name="close-outline" size={24} />
              </Pressable>
              <Text variant="textBodyBlack">Edit Profile</Text>
              <Pressable onPress={handleEditProfile}>
                <IoncIcon name="checkmark-outline" size={24} />
              </Pressable>
            </Row>
            <Spacer position="top" size="large">
              <AddImageContainer>
                <ImageView
                  source={{
                    uri: avatar,
                  }}
                />
                <CameraIcon width={30} height={30} xml={camera} />
              </AddImageContainer>
            </Spacer>
            <FormContainer>
              <Spacer position="top" size="large">
                <InputContainer>
                  <LabelText variant="caption">Username</LabelText>
                  <TextInputView value={username} onChangeText={setUsername} />
                </InputContainer>
              </Spacer>
              <Spacer position="top" size="large">
                <InputContainer>
                  <LabelText variant="caption">Full Name</LabelText>
                  <TextInputView value={fullname} onChangeText={setFullname} />
                </InputContainer>
              </Spacer>
              <Spacer position="top" size="large">
                <InputContainer>
                  <LabelText variant="caption">Address</LabelText>
                  <TextInputView value={address} onChangeText={setAddress} />
                </InputContainer>
              </Spacer>
              <Spacer position="top" size="large">
                <InputContainer>
                  <LabelText variant="caption">Phone Number</LabelText>
                  <TextInputView value={phone} onChangeText={setPhone} />
                </InputContainer>
              </Spacer>
            </FormContainer>
          </Body>
        </Container>
      </ScrollView>
    </Container>
  );
};
