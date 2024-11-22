import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SelectList } from 'react-native-dropdown-select-list';

// HomeScreen component
const HomeScreen = ({ navigation, route }: any) => {
  const [menu, setMenu] = useState([
    { name: 'Spaghetti', description: 'Delicious pasta with tomato sauce', price: '12.99', course: 'Main' },
    { name: 'Chocolate Cake', description: 'Rich chocolate cake with cream', price: '5.99', course: 'Dessert' }
  ]);

  // UseEffect to update the menu when a new dish is passed via navigation
  useEffect(() => {
    if (route.params?.newDish) {
      const newDish = route.params?.newDish;
      setMenu((prevMenu) => [...prevMenu, newDish]);
    }
  }, [route.params?.newDish]);

  const removeDish = (index: number) => {
    setMenu((prevMenu) => prevMenu.filter((_, idx) => idx !== index));
  };

  const totalPrice = menu.reduce((sum, dish) => sum + parseFloat(dish.price), 0);
  const averagePrice = menu.length > 0 ? totalPrice / menu.length : 0;
  const totalItems = menu.length;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chef's Menu</Text>
      <Text style={styles.subHeader}>Total Dishes: {totalItems}</Text>
      <Text style={styles.subHeader}>Average Price: R {averagePrice.toFixed(2)}</Text>

      <ScrollView style={styles.menuList}>
        {menu.map((dish, index) => (
          <View key={index} style={styles.menuItem}>
            <Text style={styles.menuText}>{dish.name} - {dish.course}</Text>
            <Text style={styles.menuText}>{dish.description}</Text>
            <Text style={styles.menuText}>R {dish.price}</Text>
            <TouchableOpacity onPress={() => removeDish(index)} style={styles.removeButton}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Button title="Add Dish" onPress={() => navigation.navigate('Menu')} />
    </View>
  );
};

// MenuScreen component
const MenuScreen = ({ navigation }: any) => {
  const [dishName, setDishName] = useState('');
  const [descriptionText, setDescriptionText] = useState('');
  const [dishPrice, setDishPrice] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const courseData = [
    { key: '1', value: 'Starter' },
    { key: '2', value: 'Main' },
    { key: '3', value: 'Dessert' },
    { key: '4', value: 'Drinks' },
  ];

  const handleAddDish = () => {
    const price = parseFloat(dishPrice);
    if (isNaN(price) || price <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price.');
      return;
    }

    if (dishName && descriptionText && selectedCourse) {
      const newDish = { name: dishName, description: descriptionText, price: price.toString(), course: selectedCourse };
      navigation.navigate('Home', { newDish });
      setDishName('');
      setDescriptionText('');
      setDishPrice('');
      setSelectedCourse('');
    } else {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Dish</Text>
      <TextInput style={styles.input} placeholder="Dish Name" value={dishName} onChangeText={setDishName} />
      <TextInput style={styles.input} placeholder="Description" value={descriptionText} onChangeText={setDescriptionText} />
      <TextInput style={styles.input} placeholder="Price" value={dishPrice} keyboardType="numeric" onChangeText={setDishPrice} />

      <Text style={styles.label}>Select Course:</Text>
      <SelectList data={courseData} setSelected={setSelectedCourse} save="value" placeholder="Select Course" boxStyles={styles.dropdown} />

      <Button title="Add Dish" onPress={handleAddDish} />
    </View>
  );
};

// Stack Navigation Setup
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5DC',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subHeader: {
    fontSize: 18,
    marginVertical: 10,
  },
  menuList: {
    marginTop: 20,
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    flex: 1,
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  removeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#383124',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  dropdown: {
    borderColor: '#383124',
    borderRadius: 5,
    marginBottom: 10,
    height: 40,
    justifyContent: 'center',
    paddingLeft: 10,
  },
});

export default App;
