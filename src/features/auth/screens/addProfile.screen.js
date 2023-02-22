import React, { useState, useContext } from "react";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import camera from "../../../../assets/camera";
import { TextInputView } from "../../../components/utility/text-input.component";
import { Text } from "../../../components/typography/text.component";
import { ButtonPrimary } from "../../../components/utility/button-primary.component";
import { ScrollView } from "react-native";
import firsebase from "../../../services/database/firebase";
import * as ImagePicker from "expo-image-picker";
import {
  Container,
  Body,
  Title,
  AddImageContainer,
  ImageView,
  CameraIcon,
  FormContainer,
  InputContainer,
  LabelText,
  Footer,
  ButtonContainer,
} from "../components/addProfile.style";
import firebase from "../../../services/database/firebase";
import { NewsContext } from "../../../services/news/news.context";

export const AddProfileScreen = ({ navigation }) => {
  const { setInfoUser } = useContext(NewsContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handleOnChangeUsername = (value) => {
    setUsername(value);
  };

  const handleOnChangeFullname = (value) => {
    setFullname(value);
  };

  const handleOnChangeAddress = (value) => {
    setAddress(value);
  };

  const handleOnChangePhone = (value) => {
    setPhone(value);
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

  const handleAddProfile = () => {
    const user = firsebase.auth().currentUser;
    const uid = user.uid;

    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(`images/${uid}/`);
    imageRef
      .put(selectedImage, { contentType: "image/jpeg" })
      .then(() => {
        imageRef.getDownloadURL().then((url) => {
          firsebase
            .firestore()
            .collection("users")
            .doc(uid)
            .set({
              username: username,
              fullname: fullname,
              address: address,
              phone: phone,
              avatar: url,
            })
            .then((res) => {
              setInfoUser({
                username: res.username,
                fullname: res.fullname,
                address: res.address,
                phone: res.phone,
                avatar: res.url,
              });
              navigation.navigate("Main");
            });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <SafeArea>
      <ScrollView>
        <Container>
          <Body>
            <Title>Fill your Profile</Title>
            <Spacer position="top" size="large">
              <AddImageContainer onPress={pickImageAsync}>
                <ImageView
                  source={{
                    uri: selectedImage,
                  }}
                />
                <CameraIcon width={30} height={30} xml={camera} />
              </AddImageContainer>
            </Spacer>
            <FormContainer>
              <Spacer position="top" size="large">
                <InputContainer>
                  <LabelText variant="caption">Username</LabelText>
                  <TextInputView
                    value={username}
                    onChangeText={handleOnChangeUsername}
                  />
                </InputContainer>
              </Spacer>
              <Spacer position="top" size="large">
                <InputContainer>
                  <LabelText variant="caption">Full Name</LabelText>
                  <TextInputView
                    value={fullname}
                    onChangeText={handleOnChangeFullname}
                  />
                </InputContainer>
              </Spacer>
              <Spacer position="top" size="large">
                <InputContainer>
                  <LabelText variant="caption">Address</LabelText>
                  <TextInputView
                    value={address}
                    onChangeText={handleOnChangeAddress}
                  />
                </InputContainer>
              </Spacer>
              <Spacer position="top" size="large">
                <InputContainer>
                  <LabelText variant="caption">Phone Number</LabelText>
                  <TextInputView
                    value={phone}
                    onChangeText={handleOnChangePhone}
                  />
                </InputContainer>
              </Spacer>
            </FormContainer>
          </Body>
          <Footer>
            <ButtonContainer>
              <ButtonPrimary
                onPress={() => {
                  handleAddProfile();
                }}
              >
                <Text variant="buttonText">Next</Text>
              </ButtonPrimary>
            </ButtonContainer>
          </Footer>
        </Container>
      </ScrollView>
    </SafeArea>
  );
};
