import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Animated,
  Vibration,
} from 'react-native'
import React, { useRef, useState } from 'react'
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Clipboard from '@react-native-clipboard/clipboard';

// Form -> 'Formik', validations - 'Yup'
import * as Yup from 'yup';
import { Formik } from 'formik';


const passwordSchema = Yup.object().shape({
  passwordLength: Yup.number()
    .required('Enter a Number')
    .min(4, 'minimum value is 4')
    .max(999, 'value greater than maximum length')
    .integer('Only integers expected')
    .typeError('Only numbers accepted')
})

export default function App() {

  const [password, setPassword] = useState('')
  const [isPassGenerated, setIsPassGenerated] = useState(false)
  const [lowercase, setLowercase] = useState(true)
  const [uppercase, setUppercase] = useState(false)
  const [numbers, setNumbers] = useState(true)
  const [symbols, setSymbols] = useState(false)

  // useRef and Animated for highlighting
  const highlightAnim = useRef(new Animated.Value(0)).current;
  const textRef = useRef(null);

  const copy = async (pass: string) => {
    Clipboard.setString(pass)

    // Trigger highlight animation
    Animated.sequence([
      Animated.timing(highlightAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(highlightAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }
  const generatePassString = (length: number) => {
    let characters = ''
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const digitChars = '0123456789';
    const specialChars = '!@#$%^&*()_+';

    if (lowercase) {
      characters += lowerCaseChars
    }
    if (uppercase) {
      characters += upperCaseChars
    }
    if (numbers) {
      characters += digitChars
    }
    if (symbols) {
      characters += specialChars
    }

    if (length >= 4 && length <= 999) {

      const generatePassword = generatePass(characters, length)
      setPassword(generatePassword)
      setIsPassGenerated(true)
    }

  };

  const generatePass = (characters: string, length: number) => {
    let result = ''
    for (let i = 0; i < length; i++) {
      const random = Math.floor(Math.random() * characters.length)
      result += characters.charAt(random)
    }
    return result
  };

  const vibrate = () => Vibration.vibrate(100)

  const resetPass = () => {
    setPassword('')
    setIsPassGenerated(false)
    setLowercase(true)
    setUppercase(false)
    setNumbers(false)
    setSymbols(false)
  }

  return (
    <ScrollView keyboardShouldPersistTaps='handled' style={{ borderWidth: 6, borderColor: 'transparent' }}>
      <SafeAreaView style={styles.appContainer}>
        <Text style={styles.title}>Password Generator</Text>

        <Formik
          initialValues={{ passwordLength: '' }}
          validationSchema={passwordSchema}
          onSubmit={values => {
            console.log(values);
            generatePassString(Number(values.passwordLength))
          }}
        >
          {({
            values,
            errors,
            touched,
            isValid,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
          }) => (
            <>
              {/* Password Display Pannel */}
              {isPassGenerated && (+values.passwordLength >= 4 && +values.passwordLength <= 999)
                ?
                <View style={styles.passPannel}>
                  <Animated.Text
                    ref={textRef}
                    selectable={true}
                    style={[
                      styles.passPannelText,
                      { color: '#003566' },
                      {
                        backgroundColor: highlightAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['transparent', 'yellow'],
                        }),
                      },
                    ]}
                  >
                    {password}
                  </Animated.Text>
                </View>
                :
                <View style={styles.passPannel}>
                  <Text selectable={false} style={styles.passPannelText}>
                    Password
                  </Text>
                </View>
              }

              {/* Password Length */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputColumn}>
                  <Text style={styles.heading}>Password Length</Text>
                </View>

                {/* Input - Password Length */}
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={handleChange('passwordLength')}
                  onBlur={handleBlur('passwordLength')}
                  onFocus={handleBlur('passwordLength')}
                  value={values.passwordLength}

                  keyboardType="numeric"
                  placeholder="Number"
                />

              </View>
              <View
                style={{}}
              >
                {touched.passwordLength && errors.passwordLength &&
                  (<Text style={styles.errorText}>{errors.passwordLength}</Text>)}
              </View>

              <View style={[styles.inputWrapper, { marginTop: 10 }]}>
                <Text style={styles.heading}>Include lowercase Letters</Text>
                <BouncyCheckbox
                  disableBuiltInState
                  isChecked={lowercase}
                  onPress={() => setLowercase(!lowercase)}
                  fillColor="#29AB87"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.heading}>Include Uppercase Letters</Text>
                <BouncyCheckbox
                  disableBuiltInState
                  isChecked={uppercase}
                  onPress={() => setUppercase(!uppercase)}
                  fillColor="#FED85D"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.heading}>Include Numbers</Text>
                <BouncyCheckbox
                  disableBuiltInState
                  isChecked={numbers}
                  onPress={() => setNumbers(!numbers)}
                  fillColor="#C9A0DC"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.heading}>Include Symbols</Text>
                <BouncyCheckbox
                  disableBuiltInState
                  isChecked={symbols}
                  onPress={() => setSymbols(!symbols)}
                  fillColor="#FC80A5"
                />
              </View>

              {/* Button Functionalities */}
              <View style={styles.formActions}>

                {/* Submit Button */}
                <TouchableOpacity
                  disabled={!isValid}
                  style={[styles.button, styles.primaryBtn]}
                  onPress={() => {
                    handleSubmit
                  }}
                >
                  <Text
                    style={[styles.buttonText, styles.primaryBtnTxt]}
                    onPress={() =>{
                      generatePassString(+values.passwordLength)
                      vibrate()
                    }}
                  >Generate</Text>
                </TouchableOpacity>

                {/* Reset Button */}
                <TouchableOpacity
                  style={[styles.button, styles.secondaryBtn]}
                  onPress={() => {
                    handleReset()
                    resetPass()
                    vibrate()
                  }}
                >
                  <Text style={[styles.buttonText, styles.secondaryBtnTxt]}>Reset</Text>
                </TouchableOpacity>

                {/* Copy Button */}
                <TouchableOpacity
                  style={[styles.button, styles.copyButton]}
                  onPress={() => {
                    copy(password)
                    if (password !== '') {
                      vibrate()
                    }
                  }}
                >
                  <Text
                    style={[styles.buttonText, styles.copyBtnText]}
                  >
                    Copy
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </SafeAreaView>
    </ScrollView>
  )
}

let styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  formContainer: {
    margin: 8,
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginVertical: 5,
    color: 'black',
    textAlign: 'center'
  },
  subTitle: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 2,
  },
  passPannel: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10
  },
  passPannelText: {
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontWeight: 'bold',

  },
  description: {
    color: '#758283',
    marginBottom: 8,
  },
  heading: {
    fontSize: 15,
  },
  inputWrapper: {
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  inputColumn: {
    flexDirection: 'column',
  },
  inputStyle: {
    padding: 8,
    width: '30%',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#16213e',
    marginBottom: -10
  },
  errorText: {
    fontSize: 14,
    color: '#ff0d10',
    textAlign: 'right',
    marginHorizontal: 3
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    width: 100,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  primaryBtn: {
    backgroundColor: '#5DA3FA',
  },
  primaryBtnTxt: {

  },
  secondaryBtn: {
    backgroundColor: '#15616d',
  },
  secondaryBtnTxt: {

  },
  copyButton: {
    backgroundColor: '#fb8500',
  },
  copyBtnText: {

  },
  card: {
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 12,
  },
  cardElevated: {
    backgroundColor: '#ffffff',
    elevation: 1,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: '#333',
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  generatedPassword: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 12,
    color: '#000'
  },
})