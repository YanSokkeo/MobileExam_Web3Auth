import { atom, useAtom } from "jotai";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const selectedComponentAtom = atom<string[]>([]);

export const useSelectedComponent = () => {
  const [selectedComponents, setSelectedComponents] = useAtom(
    selectedComponentAtom
  );

  const addSelectedComponent = async (id: string) => {
    setSelectedComponents((prev) => [...prev, id]);
    await storeSelectedComponents([...selectedComponents, id]);
  };

  const removeSelectedComponent = async (id: string) => {
    setSelectedComponents((prev) => prev.filter((item) => item !== id));
    await storeSelectedComponents(
      selectedComponents.filter((item) => item !== id)
    );
  };

  const storeSelectedComponents = async (components: string[]) => {
    try {
      await AsyncStorage.setItem("ids", JSON.stringify(components));
      console.log("Selected components stored successfully");
    } catch (error) {
      console.error("Error storing selected components:", error);
    }
  };

  const loadSelectedComponents = async () => {
    try {
      const storedComponents = await AsyncStorage.getItem("ids");
      if (storedComponents) {
        setSelectedComponents(JSON.parse(storedComponents));
        console.log("Selected components loaded successfully");
      }
    } catch (error) {
      console.error("Error loading selected components:", error);
    }
  };

  return {
    selectedComponents,
    addSelectedComponent,
    removeSelectedComponent,
    loadSelectedComponents,
  };
};
