import React, { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView, View, Text, TextInput, ScrollView, Pressable,
  StyleSheet, Modal, Alert, I18nManager
} from 'react-native';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const categories = ['الكل','إلكترونيات','ملابس','منزل','سيارات','عقارات','مواد غذائية','خدمات'];
const initialProducts = [
  {id:'1', name:'هاتف ذكي', category:'إلكترونيات', price:'350,000', city:'بغداد', description:'هاتف بحالة ممتازة'},
  {id:'2', name:'ساعة يد', category:'إلكترونيات', price:'45,000', city:'أربيل', description:'ساعة أنيقة'},
  {id:'3', name:'حقيبة نسائية', category:'ملابس', price:'25,000', city:'الموصل', description:'حقيبة جديدة'},
];

export default function App() {
  const [products, setProducts] = useState(initialProducts);
  const [category, setCategory] = useState('الكل');
  const [search, setSearch] = useState('');
  const [adminOpen, setAdminOpen] = useState(false);
  const [form, setForm] = useState({name:'', category:'إلكترونيات', price:'', city:'', description:''});

  const visible = useMemo(() => products.filter(p =>
    (category === 'الكل' || p.category === category) &&
    (p.name + p.city + p.category).toLowerCase().includes(search.toLowerCase())
  ), [products, category, search]);

  const addProduct = () => {
    if (!form.name.trim() || !form.price.trim() || !form.city.trim()) {
      Alert.alert('بيانات ناقصة', 'أدخل اسم المنتج والسعر والمدينة.');
      return;
    }
    setProducts([{...form, id:String(Date.now())}, ...products]);
    setForm({name:'', category:'إلكترونيات', price:'', city:'', description:''});
    setAdminOpen(false);
    Alert.alert('تمت الإضافة', 'أُضيف المنتج إلى قائمة العرض على هذا الجهاز التجريبي.');
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={s.page}>
        <View style={s.header}>
          <View>
            <Text style={s.brand}>شغلات</Text>
            <Text style={s.subtitle}>SHAGHLAT · السوق العراقي</Text>
          </View>
          <View style={s.flag}><Text style={s.flagText}>🇮🇶</Text></View>
        </View>

        <View style={s.hero}>
          <Text style={s.heroTitle}>كل العراق.. سوق واحد</Text>
          <Text style={s.heroText}>تسوّق واكتشف المنتجات من مختلف المحافظات</Text>
        </View>

        <TextInput
          style={s.search}
          placeholder="ابحث عن منتج أو مدينة..."
          placeholderTextColor="#8A9691"
          value={search}
          onChangeText={setSearch}
        />

        <View style={s.sectionHead}>
          <Text style={s.sectionTitle}>الأقسام</Text>
          <Text style={s.muted}>اختر القسم المناسب</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
          {categories.map(c => (
            <Pressable key={c} onPress={() => setCategory(c)} style={[s.chip, category===c && s.chipActive]}>
              <Text style={[s.chipText, category===c && s.chipTextActive]}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={s.sectionHead}>
          <Text style={s.sectionTitle}>أحدث المنتجات</Text>
          <Text style={s.count}>{visible.length} منتج</Text>
        </View>

        <View style={s.grid}>
          {visible.map(p => (
            <View key={p.id} style={s.card}>
              <View style={s.productIcon}><Text style={s.productEmoji}>🛍️</Text></View>
              <Text style={s.productName}>{p.name}</Text>
              <Text style={s.productCategory}>{p.category}</Text>
              <Text style={s.price}>{p.price} د.ع</Text>
              <Text style={s.city}>📍 {p.city}</Text>
              {!!p.description && <Text style={s.description}>{p.description}</Text>}
            </View>
          ))}
        </View>
        {visible.length===0 && <Text style={s.empty}>لا توجد منتجات مطابقة للبحث حالياً.</Text>}

        <Pressable style={s.adminButton} onPress={() => setAdminOpen(true)}>
          <Text style={s.adminButtonText}>＋ لوحة الإدارة · إضافة منتج</Text>
        </Pressable>
        <Text style={s.note}>نسخة أولية تجريبية — المنتجات تُحفظ مؤقتاً داخل التطبيق فقط.</Text>
        <Text style={s.footer}>شغلات | SHAGHLAT © 2026</Text>
      </ScrollView>

      <Modal visible={adminOpen} animationType="slide" onRequestClose={() => setAdminOpen(false)}>
        <SafeAreaView style={s.modalSafe}>
          <ScrollView contentContainerStyle={s.modalPage}>
            <Text style={s.modalTitle}>إضافة منتج جديد</Text>
            <Text style={s.modalHint}>هذه شاشة تجريبية للإدارة. سنضيف تسجيل دخول إداري آمن وربط قاعدة البيانات في المرحلة التالية.</Text>
            <TextInput style={s.field} placeholder="اسم المنتج *" value={form.name} onChangeText={v=>setForm({...form,name:v})}/>
            <Text style={s.label}>القسم</Text>
            <View style={s.categoryWrap}>
              {categories.slice(1).map(c=><Pressable key={c} onPress={()=>setForm({...form,category:c})} style={[s.smallChip,form.category===c&&s.chipActive]}><Text style={form.category===c?s.chipTextActive:s.chipText}>{c}</Text></Pressable>)}
            </View>
            <TextInput style={s.field} placeholder="السعر بالدينار العراقي *" keyboardType="numeric" value={form.price} onChangeText={v=>setForm({...form,price:v})}/>
            <TextInput style={s.field} placeholder="المحافظة أو المدينة *" value={form.city} onChangeText={v=>setForm({...form,city:v})}/>
            <TextInput style={[s.field,s.multiline]} placeholder="وصف المنتج (اختياري)" multiline value={form.description} onChangeText={v=>setForm({...form,description:v})}/>
            <Pressable style={s.saveButton} onPress={addProduct}><Text style={s.saveText}>إضافة المنتج</Text></Pressable>
            <Pressable style={s.cancelButton} onPress={()=>setAdminOpen(false)}><Text style={s.cancelText}>رجوع</Text></Pressable>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#F4F7F5'}, page:{padding:18,paddingBottom:32},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:18},
  brand:{fontSize:32,fontWeight:'900',color:'#123D2C'}, subtitle:{fontSize:12,color:'#668074',marginTop:2,letterSpacing:1},
  flag:{backgroundColor:'#E1EEE6',padding:12,borderRadius:16},flagText:{fontSize:23},
  hero:{backgroundColor:'#123D2C',padding:22,borderRadius:22,marginBottom:16},
  heroTitle:{fontSize:24,fontWeight:'900',color:'#FFFFFF',textAlign:'right'},
  heroText:{fontSize:14,color:'#D8E8DF',textAlign:'right',marginTop:8},
  search:{backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#E1E9E4',borderRadius:14,padding:15,fontSize:15,textAlign:'right',marginBottom:22,color:'#173B2D'},
  sectionHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12},
  sectionTitle:{fontSize:19,fontWeight:'800',color:'#173B2D'},muted:{fontSize:12,color:'#809087'},count:{fontSize:12,color:'#668074'},
  chips:{gap:8,paddingBottom:20},chip:{paddingVertical:9,paddingHorizontal:15,borderRadius:22,backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#DFE8E2'},
  chipActive:{backgroundColor:'#176B48',borderColor:'#176B48'},chipText:{color:'#426052',fontSize:13,fontWeight:'600'},chipTextActive:{color:'#FFFFFF',fontSize:13,fontWeight:'700'},
  grid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:12},
  card:{width:'48%',backgroundColor:'#FFFFFF',borderRadius:17,padding:13,borderWidth:1,borderColor:'#E6ECE8',marginBottom:2},
  productIcon:{height:88,backgroundColor:'#EFF5F1',borderRadius:12,alignItems:'center',justifyContent:'center',marginBottom:10},
  productEmoji:{fontSize:38},productName:{fontSize:15,fontWeight:'800',color:'#1D3E30',textAlign:'right'},
  productCategory:{fontSize:11,color:'#819188',textAlign:'right',marginTop:4},price:{fontSize:15,fontWeight:'900',color:'#16734B',textAlign:'right',marginTop:8},
  city:{fontSize:11,color:'#718078',textAlign:'right',marginTop:5},description:{fontSize:11,color:'#718078',textAlign:'right',marginTop:5},
  empty:{textAlign:'center',color:'#718078',padding:24},adminButton:{backgroundColor:'#E2EFE7',padding:16,borderRadius:14,alignItems:'center',marginTop:22},
  adminButtonText:{color:'#176B48',fontWeight:'800',fontSize:15},note:{textAlign:'center',fontSize:11,color:'#87948D',marginTop:12,lineHeight:18},
  footer:{textAlign:'center',fontSize:11,color:'#A0AAA4',marginTop:22},
  modalSafe:{flex:1,backgroundColor:'#F4F7F5'},modalPage:{padding:20,paddingBottom:40},modalTitle:{fontSize:25,fontWeight:'900',color:'#123D2C',textAlign:'right',marginBottom:8},
  modalHint:{fontSize:13,color:'#738078',textAlign:'right',lineHeight:21,marginBottom:18},
  field:{backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#DDE7E0',borderRadius:12,padding:14,fontSize:15,textAlign:'right',marginBottom:12,color:'#173B2D'},
  label:{fontSize:14,fontWeight:'700',color:'#315342',textAlign:'right',marginBottom:9},categoryWrap:{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:14},
  smallChip:{paddingHorizontal:12,paddingVertical:9,borderRadius:20,backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#DDE7E0'},
  multiline:{height:90,textAlignVertical:'top'},saveButton:{backgroundColor:'#176B48',padding:16,borderRadius:13,alignItems:'center',marginTop:6},
  saveText:{color:'#FFFFFF',fontSize:16,fontWeight:'800'},cancelButton:{padding:14,alignItems:'center',marginTop:8},cancelText:{color:'#5D7166',fontWeight:'700'}
});
