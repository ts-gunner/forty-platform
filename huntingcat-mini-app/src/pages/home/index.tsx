import { useState } from "react";
import { View,Text, ScrollView, Image, Input } from "@tarojs/components";
import "./index.scss";
const activeCustomers = [
    { id: 0, name: 'Alex', active: true },
    { id: 1, name: 'Sarah', active: true },
    { id: 2, name: 'Michael', active: false },
    { id: 3, name: 'Emily', active: false },
    { id: 4, name: 'David', active: false },
  ];

  const allCustomers = [
    { id: 5, name: 'Thomas Jenkins', company: 'TechPulse Solutions', tag: 'VIP', type: 'primary' },
    { id: 6, name: 'Elena Rodriguez', company: 'Global Retail Inc.', tag: 'POTENTIAL', type: 'blue' },
    { id: 7, name: 'Marcus Chen', company: 'Innovate Lab', tag: 'VIP', type: 'primary' },
    { id: 8, name: 'Sophia Williams', company: 'Creative Studio', tag: 'POTENTIAL', type: 'blue' },
    { id: 9, name: 'James Wilson', company: 'Nexus Logistics', tag: 'POTENTIAL', type: 'blue' },
  ];
export default function Index() {

  return (
    <View className="mesh-gradient min-h-screen">
      
     
    </View>
  );
}
