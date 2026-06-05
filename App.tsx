import { StatusBar } from 'expo-status-bar';
import { useState, useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

// ─── Couleurs ───────────────────────────────────────────────────────────────
const PRIMARY = '#1B8B4B';
const ACCENT = '#F5A623';
const DANGER = '#E53935';
const SAFE = '#2E7D32';
const BG = '#F2F6F2';

// ─── Types ──────────────────────────────────────────────────────────────────
type Categorie =
  | 'Céréales'
  | 'Huiles'
  | 'Sucre & Sel'
  | 'Pain & Farine'
  | 'Lait & Œufs'
  | 'Légumes'
  | 'Poissons & Viandes'
  | 'Hygiène';

type Screen = 'login' | 'home' | 'detail' | 'report' | 'confirmation';

interface Prix {
  date: string;
  valeur: number;
}

interface Produit {
  id: string;
  nom: string;
  categorie: Categorie;
  unite: string;
  prixActuel: number;
  icone: string;
  historique: Prix[];
  description: string;
}

// ─── Données produits ────────────────────────────────────────────────────────
const PRODUITS: Produit[] = [
  {
    id: 'riz-brise',
    nom: 'Riz brisé',
    categorie: 'Céréales',
    unite: 'Sac 50 kg',
    prixActuel: 18000,
    icone: '🌾',
    historique: [
      { date: 'Jan 2024', valeur: 15000 },
      { date: 'Avr 2024', valeur: 16500 },
      { date: 'Oct 2024', valeur: 17000 },
      { date: 'Jan 2025', valeur: 18000 },
    ],
    description:
      "Riz brisé importé, prix officiel homologué par l'État du Sénégal. Base de l'alimentation quotidienne des ménages sénégalais.",
  },
  {
    id: 'riz-entier',
    nom: 'Riz entier',
    categorie: 'Céréales',
    unite: 'Sac 50 kg',
    prixActuel: 22000,
    icone: '🌾',
    historique: [
      { date: 'Jan 2024', valeur: 19000 },
      { date: 'Avr 2024', valeur: 20500 },
      { date: 'Oct 2024', valeur: 21000 },
      { date: 'Jan 2025', valeur: 22000 },
    ],
    description:
      'Riz entier à grain long, produit de qualité supérieure. Idéal pour le thiéboudienne et les plats de fête.',
  },
  {
    id: 'mil',
    nom: 'Mil',
    categorie: 'Céréales',
    unite: 'kg',
    prixActuel: 350,
    icone: '🌾',
    historique: [
      { date: 'Jan 2024', valeur: 280 },
      { date: 'Avr 2024', valeur: 300 },
      { date: 'Oct 2024', valeur: 330 },
      { date: 'Jan 2025', valeur: 350 },
    ],
    description:
      'Mil local cultivé au Sénégal. Base du lakh et du thiakry, aliment culturel essentiel.',
  },
  {
    id: 'mais',
    nom: 'Maïs',
    categorie: 'Céréales',
    unite: 'kg',
    prixActuel: 200,
    icone: '🌽',
    historique: [
      { date: 'Jan 2024', valeur: 160 },
      { date: 'Avr 2024', valeur: 175 },
      { date: 'Oct 2024', valeur: 190 },
      { date: 'Jan 2025', valeur: 200 },
    ],
    description:
      'Maïs jaune en grains, production locale. Utilisé en farine ou bouilli.',
  },
  {
    id: 'sorgho',
    nom: 'Sorgho',
    categorie: 'Céréales',
    unite: 'kg',
    prixActuel: 180,
    icone: '🌾',
    historique: [
      { date: 'Jan 2024', valeur: 150 },
      { date: 'Avr 2024', valeur: 160 },
      { date: 'Oct 2024', valeur: 170 },
      { date: 'Jan 2025', valeur: 180 },
    ],
    description:
      'Sorgho rouge local, céréale résistante à la sécheresse, cultivée dans le Sahel sénégalais.',
  },
  {
    id: 'huile-vegetale',
    nom: 'Huile végétale',
    categorie: 'Huiles',
    unite: 'Bidon 20 L',
    prixActuel: 21500,
    icone: '🫙',
    historique: [
      { date: 'Jan 2024', valeur: 18000 },
      { date: 'Avr 2024', valeur: 19500 },
      { date: 'Oct 2024', valeur: 20500 },
      { date: 'Jan 2025', valeur: 21500 },
    ],
    description:
      'Huile végétale raffinée, usage culinaire courant. Prix homologué par le Ministère du Commerce.',
  },
  {
    id: 'huile-arachide',
    nom: "Huile d'arachide",
    categorie: 'Huiles',
    unite: 'Litre',
    prixActuel: 1800,
    icone: '🥜',
    historique: [
      { date: 'Jan 2024', valeur: 1500 },
      { date: 'Avr 2024', valeur: 1600 },
      { date: 'Oct 2024', valeur: 1700 },
      { date: 'Jan 2025', valeur: 1800 },
    ],
    description:
      "Huile d'arachide pure, produit emblématique de l'économie sénégalaise. Saveur authentique.",
  },
  {
    id: 'sucre',
    nom: 'Sucre cristallisé',
    categorie: 'Sucre & Sel',
    unite: 'kg',
    prixActuel: 600,
    icone: '🍬',
    historique: [
      { date: 'Jan 2024', valeur: 500 },
      { date: 'Avr 2024', valeur: 550 },
      { date: 'Oct 2024', valeur: 575 },
      { date: 'Jan 2025', valeur: 600 },
    ],
    description:
      'Sucre cristallisé blanc produit par la CSS (Compagnie Sucrière Sénégalaise). Prix encadré.',
  },
  {
    id: 'sel',
    nom: 'Sel iodé',
    categorie: 'Sucre & Sel',
    unite: 'kg',
    prixActuel: 150,
    icone: '🧂',
    historique: [
      { date: 'Jan 2024', valeur: 125 },
      { date: 'Avr 2024', valeur: 130 },
      { date: 'Oct 2024', valeur: 140 },
      { date: 'Jan 2025', valeur: 150 },
    ],
    description:
      'Sel iodé de table, production de Kaolack. Enrichi en iode pour lutter contre les carences.',
  },
  {
    id: 'pain',
    nom: 'Pain (baguette 200g)',
    categorie: 'Pain & Farine',
    unite: 'Pièce',
    prixActuel: 150,
    icone: '🥖',
    historique: [
      { date: 'Jan 2024', valeur: 125 },
      { date: 'Avr 2024', valeur: 125 },
      { date: 'Oct 2024', valeur: 150 },
      { date: 'Jan 2025', valeur: 150 },
    ],
    description:
      'Baguette de pain de 200g, prix fixé par décret présidentiel. Produit de première nécessité.',
  },
  {
    id: 'farine',
    nom: 'Farine de blé',
    categorie: 'Pain & Farine',
    unite: 'Sac 50 kg',
    prixActuel: 16500,
    icone: '🌾',
    historique: [
      { date: 'Jan 2024', valeur: 14000 },
      { date: 'Avr 2024', valeur: 15000 },
      { date: 'Oct 2024', valeur: 16000 },
      { date: 'Jan 2025', valeur: 16500 },
    ],
    description:
      'Farine de blé type 45, usage boulangerie et pâtisserie. Importée et contrôlée par les services de qualité.',
  },
  {
    id: 'lait-poudre',
    nom: 'Lait en poudre',
    categorie: 'Lait & Œufs',
    unite: 'Sachet 500g',
    prixActuel: 2500,
    icone: '🥛',
    historique: [
      { date: 'Jan 2024', valeur: 2100 },
      { date: 'Avr 2024', valeur: 2200 },
      { date: 'Oct 2024', valeur: 2400 },
      { date: 'Jan 2025', valeur: 2500 },
    ],
    description:
      'Lait entier en poudre, riche en calcium et vitamines. Reconstitué avec de l\'eau pour la consommation quotidienne.',
  },
  {
    id: 'lait-concentre',
    nom: 'Lait concentré sucré',
    categorie: 'Lait & Œufs',
    unite: 'Boîte 397g',
    prixActuel: 900,
    icone: '🥛',
    historique: [
      { date: 'Jan 2024', valeur: 750 },
      { date: 'Avr 2024', valeur: 800 },
      { date: 'Oct 2024', valeur: 850 },
      { date: 'Jan 2025', valeur: 900 },
    ],
    description:
      'Lait concentré sucré, incontournable du café touba et du thé attaya sénégalais.',
  },
  {
    id: 'oeufs',
    nom: 'Œufs de poule',
    categorie: 'Lait & Œufs',
    unite: 'Plateau 30 pcs',
    prixActuel: 3500,
    icone: '🥚',
    historique: [
      { date: 'Jan 2024', valeur: 2800 },
      { date: 'Avr 2024', valeur: 3000 },
      { date: 'Oct 2024', valeur: 3200 },
      { date: 'Jan 2025', valeur: 3500 },
    ],
    description:
      'Œufs frais de poule, production avicole locale. Source de protéines accessible et essentielle.',
  },
  {
    id: 'oignon',
    nom: 'Oignon local',
    categorie: 'Légumes',
    unite: 'kg',
    prixActuel: 350,
    icone: '🧅',
    historique: [
      { date: 'Jan 2024', valeur: 250 },
      { date: 'Avr 2024', valeur: 400 },
      { date: 'Oct 2024', valeur: 300 },
      { date: 'Jan 2025', valeur: 350 },
    ],
    description:
      'Oignon violet de Dahra, production nationale certifiée. Ingrédient de base de toute cuisine sénégalaise.',
  },
  {
    id: 'tomate',
    nom: 'Tomate fraîche',
    categorie: 'Légumes',
    unite: 'kg',
    prixActuel: 400,
    icone: '🍅',
    historique: [
      { date: 'Jan 2024', valeur: 300 },
      { date: 'Avr 2024', valeur: 500 },
      { date: 'Oct 2024', valeur: 350 },
      { date: 'Jan 2025', valeur: 400 },
    ],
    description:
      'Tomate ronde fraîche, cultivée dans la vallée du fleuve Sénégal. Base du thiéboudienne et du yassa.',
  },
  {
    id: 'pomme-de-terre',
    nom: 'Pomme de terre',
    categorie: 'Légumes',
    unite: 'kg',
    prixActuel: 500,
    icone: '🥔',
    historique: [
      { date: 'Jan 2024', valeur: 400 },
      { date: 'Avr 2024', valeur: 450 },
      { date: 'Oct 2024', valeur: 480 },
      { date: 'Jan 2025', valeur: 500 },
    ],
    description:
      'Pomme de terre importée, variété bintje. Utilisée en accompagnement ou dans la soupe kandia.',
  },
  {
    id: 'carotte',
    nom: 'Carotte',
    categorie: 'Légumes',
    unite: 'kg',
    prixActuel: 300,
    icone: '🥕',
    historique: [
      { date: 'Jan 2024', valeur: 250 },
      { date: 'Avr 2024', valeur: 280 },
      { date: 'Oct 2024', valeur: 290 },
      { date: 'Jan 2025', valeur: 300 },
    ],
    description:
      'Carotte fraîche, production de la vallée du fleuve Sénégal. Riche en bêta-carotène.',
  },
  {
    id: 'haricot',
    nom: 'Haricot niébé',
    categorie: 'Légumes',
    unite: 'kg',
    prixActuel: 600,
    icone: '🫘',
    historique: [
      { date: 'Jan 2024', valeur: 450 },
      { date: 'Avr 2024', valeur: 500 },
      { date: 'Oct 2024', valeur: 550 },
      { date: 'Jan 2025', valeur: 600 },
    ],
    description:
      'Haricot niébé (thiaw) local, riche en protéines végétales. Ingrédient clé du thiébou yapp.',
  },
  {
    id: 'thiof',
    nom: 'Thiof (mérou)',
    categorie: 'Poissons & Viandes',
    unite: 'kg',
    prixActuel: 4500,
    icone: '🐟',
    historique: [
      { date: 'Jan 2024', valeur: 3500 },
      { date: 'Avr 2024', valeur: 3800 },
      { date: 'Oct 2024', valeur: 4200 },
      { date: 'Jan 2025', valeur: 4500 },
    ],
    description:
      'Thiof frais (mérou), poisson national emblématique du Sénégal. Plébiscité pour le thiéboudienne.',
  },
  {
    id: 'sardines',
    nom: 'Sardines en boîte',
    categorie: 'Poissons & Viandes',
    unite: 'Boîte 125g',
    prixActuel: 500,
    icone: '🐟',
    historique: [
      { date: 'Jan 2024', valeur: 400 },
      { date: 'Avr 2024', valeur: 425 },
      { date: 'Oct 2024', valeur: 475 },
      { date: 'Jan 2025', valeur: 500 },
    ],
    description:
      'Sardines à la tomate en conserve, source de protéines accessibles pour les ménages.',
  },
  {
    id: 'poulet',
    nom: 'Poulet de chair',
    categorie: 'Poissons & Viandes',
    unite: 'kg',
    prixActuel: 2200,
    icone: '🍗',
    historique: [
      { date: 'Jan 2024', valeur: 1800 },
      { date: 'Avr 2024', valeur: 1900 },
      { date: 'Oct 2024', valeur: 2100 },
      { date: 'Jan 2025', valeur: 2200 },
    ],
    description:
      'Poulet de chair local, produit phare de la filière avicole sénégalaise. Prix encadré par l\'État.',
  },
  {
    id: 'boeuf',
    nom: 'Viande de bœuf',
    categorie: 'Poissons & Viandes',
    unite: 'kg',
    prixActuel: 3500,
    icone: '🥩',
    historique: [
      { date: 'Jan 2024', valeur: 3000 },
      { date: 'Avr 2024', valeur: 3200 },
      { date: 'Oct 2024', valeur: 3400 },
      { date: 'Jan 2025', valeur: 3500 },
    ],
    description:
      'Viande de bœuf locale, races zébu et ndama. Contrôlée par les services vétérinaires.',
  },
  {
    id: 'savon',
    nom: 'Savon de ménage',
    categorie: 'Hygiène',
    unite: 'Pain 400g',
    prixActuel: 300,
    icone: '🧼',
    historique: [
      { date: 'Jan 2024', valeur: 250 },
      { date: 'Avr 2024', valeur: 275 },
      { date: 'Oct 2024', valeur: 290 },
      { date: 'Jan 2025', valeur: 300 },
    ],
    description:
      'Savon de ménage multi-usage, produit de première nécessité. Fabriqué localement au Sénégal.',
  },
  {
    id: 'gaz',
    nom: 'Gaz butane',
    categorie: 'Hygiène',
    unite: 'Bouteille 6 kg',
    prixActuel: 3200,
    icone: '🔥',
    historique: [
      { date: 'Jan 2024', valeur: 2700 },
      { date: 'Avr 2024', valeur: 2900 },
      { date: 'Oct 2024', valeur: 3100 },
      { date: 'Jan 2025', valeur: 3200 },
    ],
    description:
      'Bouteille de gaz butane 6 kg, énergie domestique principale des ménages urbains sénégalais.',
  },
  {
    id: 'allumettes',
    nom: 'Allumettes',
    categorie: 'Hygiène',
    unite: 'Boîte',
    prixActuel: 50,
    icone: '🔥',
    historique: [
      { date: 'Jan 2024', valeur: 50 },
      { date: 'Avr 2024', valeur: 50 },
      { date: 'Oct 2024', valeur: 50 },
      { date: 'Jan 2025', valeur: 50 },
    ],
    description:
      'Boîte d\'allumettes standard. Prix stable — produit à usage quotidien.',
  },
];

const CATEGORIES: Categorie[] = [
  'Céréales',
  'Huiles',
  'Sucre & Sel',
  'Pain & Farine',
  'Lait & Œufs',
  'Légumes',
  'Poissons & Viandes',
  'Hygiène',
];

// ─── Composant principal ─────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [selectedProduit, setSelectedProduit] = useState<Produit | null>(null);
  const [search, setSearch] = useState('');
  const [categorie, setCategorie] = useState<Categorie | null>(null);
  const [alertes, setAlertes] = useState<Record<string, boolean>>({});

  // Login
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');

  // Signalement
  const [boutique, setBoutique] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [prixAbusif, setPrixAbusif] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [refSignalement] = useState(
    () => Math.random().toString(36).substring(2, 8).toUpperCase()
  );

  const produitsFiltres = useMemo(
    () =>
      PRODUITS.filter((p) => {
        const matchSearch = p.nom.toLowerCase().includes(search.toLowerCase());
        const matchCat = categorie ? p.categorie === categorie : true;
        return matchSearch && matchCat;
      }),
    [search, categorie]
  );

  const toggleAlerte = (id: string) =>
    setAlertes((prev) => ({ ...prev, [id]: !prev[id] }));

  // ── Écran Connexion ─────────────────────────────────────────────────────
  if (screen === 'login') {
    return (
      <KeyboardAvoidingView
        style={s.flexGreen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <StatusBar style="light" />
        <View style={s.loginTop}>
          <Text style={s.loginLogo}>SamaPrix 🇸🇳</Text>
          <Text style={s.loginSlogan}>
            Consultez les prix officiels{'\n'}des produits de première nécessité
          </Text>
        </View>
        <View style={s.loginCard}>
          <Text style={s.loginCardTitle}>Connexion</Text>
          <TextInput
            style={s.input}
            placeholder="Adresse email"
            placeholderTextColor="#9E9E9E"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={s.input}
            placeholder="Mot de passe"
            placeholderTextColor="#9E9E9E"
            secureTextEntry
            value={mdp}
            onChangeText={setMdp}
          />
          <Pressable
            style={({ pressed }) => [s.btnPrimary, pressed && s.pressed]}
            onPress={() => setScreen('home')}
          >
            <Text style={s.btnPrimaryText}>Se connecter</Text>
          </Pressable>
          <View style={s.dividerRow}>
            <View style={s.dividerLine} />
            <Text style={s.dividerLabel}>ou</Text>
            <View style={s.dividerLine} />
          </View>
          <Pressable
            style={({ pressed }) => [s.btnOutline, pressed && s.pressed]}
            onPress={() => setScreen('home')}
          >
            <Text style={s.btnOutlineText}>Créer un compte gratuit</Text>
          </Pressable>
          <Text style={s.loginFooter}>
            Données officielles du Ministère du Commerce du Sénégal
          </Text>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // ── Écran Accueil ───────────────────────────────────────────────────────
  if (screen === 'home') {
    return (
      <SafeAreaView style={s.safeGreen}>
        <StatusBar style="light" />
        {/* En-tête */}
        <View style={s.homeHeader}>
          <View>
            <Text style={s.homeGreet}>Bienvenue 👋</Text>
            <Text style={s.homeTitle}>SamaPrix 🇸🇳</Text>
          </View>
          <View style={s.countBadge}>
            <Text style={s.countBadgeText}>{produitsFiltres.length} produits</Text>
          </View>
        </View>

        {/* Barre de recherche */}
        <View style={s.searchBar}>
          <Text style={s.searchIconTxt}>🔍</Text>
          <TextInput
            style={s.searchInput}
            placeholder="Rechercher un produit..."
            placeholderTextColor="#9E9E9E"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Text style={s.clearBtn}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Catégories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.catsScroll}
          contentContainerStyle={s.catsContent}
        >
          <Pressable
            style={[s.chip, !categorie && s.chipOn]}
            onPress={() => setCategorie(null)}
          >
            <Text style={[s.chipTxt, !categorie && s.chipTxtOn]}>Tous</Text>
          </Pressable>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              style={[s.chip, categorie === cat && s.chipOn]}
              onPress={() => setCategorie(cat)}
            >
              <Text style={[s.chipTxt, categorie === cat && s.chipTxtOn]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Liste produits */}
        <ScrollView
          style={s.listScroll}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
        >
          {produitsFiltres.length === 0 && (
            <Text style={s.emptyTxt}>Aucun produit trouvé pour cette recherche.</Text>
          )}
          {produitsFiltres.map((p) => {
            const prev = p.historique[p.historique.length - 2]?.valeur;
            const up = prev !== undefined && p.prixActuel > prev;
            const diff = prev !== undefined ? Math.abs(p.prixActuel - prev) : 0;
            return (
              <Pressable
                key={p.id}
                style={({ pressed }) => [s.card, pressed && s.pressed]}
                onPress={() => {
                  setSelectedProduit(p);
                  setScreen('detail');
                }}
              >
                <View style={s.cardLeft}>
                  <Text style={s.cardIcon}>{p.icone}</Text>
                  <View style={s.cardInfo}>
                    <Text style={s.cardName}>{p.nom}</Text>
                    <Text style={s.cardUnit}>{p.unite}</Text>
                    <View style={s.catPill}>
                      <Text style={s.catPillTxt}>{p.categorie}</Text>
                    </View>
                  </View>
                </View>
                <View style={s.cardRight}>
                  <Text style={s.cardPrice}>
                    {p.prixActuel.toLocaleString('fr-FR')} F
                  </Text>
                  {prev !== undefined && (
                    <Text style={[s.cardTrend, { color: up ? DANGER : SAFE }]}>
                      {up ? '▲' : '▼'} {diff.toLocaleString('fr-FR')} F
                    </Text>
                  )}
                  {alertes[p.id] && <Text style={s.bellBadge}>🔔</Text>}
                </View>
              </Pressable>
            );
          })}
          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Écran Détail ────────────────────────────────────────────────────────
  if (screen === 'detail' && selectedProduit) {
    const p = selectedProduit;
    const prev = p.historique[p.historique.length - 2]?.valeur;
    const up = prev !== undefined && p.prixActuel > prev;
    const diff = prev !== undefined ? Math.abs(p.prixActuel - prev) : 0;

    return (
      <SafeAreaView style={s.safeGreen}>
        <StatusBar style="light" />
        <View style={s.subHeader}>
          <Pressable style={s.backBtn} onPress={() => setScreen('home')}>
            <Text style={s.backBtnTxt}>← Retour</Text>
          </Pressable>
          <Text style={s.subHeaderTitle}>Détail produit</Text>
          <View style={{ width: 80 }} />
        </View>

        <ScrollView
          style={s.listScroll}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={s.detailHero}>
            <Text style={s.detailHeroIcon}>{p.icone}</Text>
            <Text style={s.detailHeroName}>{p.nom}</Text>
            <Text style={s.detailHeroUnit}>Unité : {p.unite}</Text>
            <View style={s.detailCatPill}>
              <Text style={s.detailCatPillTxt}>{p.categorie}</Text>
            </View>
          </View>

          {/* Bloc prix */}
          <View style={s.priceBlock}>
            <View style={s.priceBlockRow}>
              <View>
                <Text style={s.priceBlockLabel}>PRIX OFFICIEL ACTUEL</Text>
                <Text style={s.priceBlockValue}>
                  {p.prixActuel.toLocaleString('fr-FR')} FCFA
                </Text>
              </View>
              {prev !== undefined && (
                <View
                  style={[
                    s.variationChip,
                    { backgroundColor: up ? '#FFEBEE' : '#E8F5E9' },
                  ]}
                >
                  <Text style={[s.variationChipVal, { color: up ? DANGER : SAFE }]}>
                    {up ? '▲' : '▼'} {diff.toLocaleString('fr-FR')} F
                  </Text>
                  <Text style={[s.variationChipLbl, { color: up ? DANGER : SAFE }]}>
                    vs prix précédent
                  </Text>
                </View>
              )}
            </View>
            {prev !== undefined && (
              <Text style={s.priceBlockPrev}>
                Ancien prix : {prev.toLocaleString('fr-FR')} FCFA
              </Text>
            )}
          </View>

          {/* Description */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Description</Text>
            <Text style={s.sectionBody}>{p.description}</Text>
          </View>

          {/* Alerte */}
          <View style={s.section}>
            <View style={s.alerteRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.sectionTitle}>🔔 Alerte de changement</Text>
                <Text style={s.sectionBody}>
                  Soyez notifié dès qu'un nouveau prix est publié pour ce produit.
                </Text>
              </View>
              <Switch
                value={!!alertes[p.id]}
                onValueChange={() => toggleAlerte(p.id)}
                trackColor={{ false: '#DDD', true: PRIMARY }}
                thumbColor="#FFF"
              />
            </View>
          </View>

          {/* Historique */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>📈 Historique des prix</Text>
            {p.historique.map((h, i) => {
              const hprev = p.historique[i - 1];
              const hup = hprev && h.valeur > hprev.valeur;
              const hdown = hprev && h.valeur < hprev.valeur;
              const dotColor = !hprev ? '#BDBDBD' : hup ? DANGER : SAFE;
              return (
                <View key={h.date} style={s.histRow}>
                  <View style={[s.histDot, { backgroundColor: dotColor }]} />
                  <View style={s.histMid}>
                    <Text style={s.histDate}>{h.date}</Text>
                    <Text style={s.histPrice}>
                      {h.valeur.toLocaleString('fr-FR')} FCFA
                    </Text>
                  </View>
                  {hprev && (
                    <Text
                      style={[
                        s.histChange,
                        { color: hup ? DANGER : hdown ? SAFE : '#999' },
                      ]}
                    >
                      {hup ? '▲' : '▼'}{' '}
                      {Math.abs(h.valeur - hprev.valeur).toLocaleString('fr-FR')}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>

          {/* Bouton signalement */}
          <Pressable
            style={({ pressed }) => [s.reportBtn, pressed && s.pressed]}
            onPress={() => setScreen('report')}
          >
            <Text style={s.reportBtnTxt}>🚨 Signaler un abus de prix</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Écran Signalement ───────────────────────────────────────────────────
  if (screen === 'report') {
    return (
      <SafeAreaView style={s.safeGreen}>
        <StatusBar style="light" />
        <View style={s.subHeader}>
          <Pressable style={s.backBtn} onPress={() => setScreen('detail')}>
            <Text style={s.backBtnTxt}>← Retour</Text>
          </Pressable>
          <Text style={s.subHeaderTitle}>Signaler un abus</Text>
          <View style={{ width: 80 }} />
        </View>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={s.listScroll}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={s.reportHero}>
              <Text style={s.reportHeroIcon}>🚨</Text>
              <Text style={s.reportHeroTitle}>Signalement d'abus</Text>
              <Text style={s.reportHeroSub}>
                Produit : {selectedProduit?.nom}
                {'\n'}Prix officiel : {selectedProduit?.prixActuel.toLocaleString('fr-FR')} FCFA
              </Text>
            </View>

            <View style={[s.section, { margin: 16 }]}>
              <Text style={s.sectionTitle}>Informations sur la boutique</Text>

              <Text style={s.inputLabel}>Nom de la boutique *</Text>
              <TextInput
                style={s.input}
                placeholder="Ex: Boutique Modou, Supermarché Auchan..."
                placeholderTextColor="#9E9E9E"
                value={boutique}
                onChangeText={setBoutique}
              />

              <Text style={s.inputLabel}>Localisation *</Text>
              <TextInput
                style={s.input}
                placeholder="Ex: Médina, HLM, Pikine, Grand-Dakar..."
                placeholderTextColor="#9E9E9E"
                value={localisation}
                onChangeText={setLocalisation}
              />

              <Text style={s.inputLabel}>Prix pratiqué abusivement *</Text>
              <TextInput
                style={s.input}
                placeholder={`Ex: 900 FCFA au lieu de ${selectedProduit?.prixActuel.toLocaleString('fr-FR')} FCFA`}
                placeholderTextColor="#9E9E9E"
                keyboardType="numeric"
                value={prixAbusif}
                onChangeText={setPrixAbusif}
              />

              <Text style={s.inputLabel}>Commentaire (facultatif)</Text>
              <TextInput
                style={[s.input, s.textarea]}
                placeholder="Décrivez la situation en détail..."
                placeholderTextColor="#9E9E9E"
                multiline
                numberOfLines={4}
                value={commentaire}
                onChangeText={setCommentaire}
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                s.btnPrimary,
                { marginHorizontal: 16 },
                pressed && s.pressed,
              ]}
              onPress={() => {
                setBoutique('');
                setLocalisation('');
                setPrixAbusif('');
                setCommentaire('');
                setScreen('confirmation');
              }}
            >
              <Text style={s.btnPrimaryText}>Envoyer le signalement</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ── Écran Confirmation ──────────────────────────────────────────────────
  if (screen === 'confirmation') {
    return (
      <SafeAreaView style={[s.safeGreen, s.confirmRoot]}>
        <StatusBar style="dark" />
        <View style={s.confirmCard}>
          <Text style={s.confirmEmoji}>✅</Text>
          <Text style={s.confirmTitle}>Signalement envoyé !</Text>
          <Text style={s.confirmBody}>
            Merci pour votre contribution. Votre signalement a été transmis aux agents du
            Ministère du Commerce du Sénégal pour vérification.
          </Text>
          <View style={s.confirmRefBox}>
            <Text style={s.confirmRefLabel}>Numéro de référence</Text>
            <Text style={s.confirmRefValue}>#{refSignalement}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [s.btnPrimary, { width: '100%' }, pressed && s.pressed]}
            onPress={() => setScreen('home')}
          >
            <Text style={s.btnPrimaryText}>Retour à l'accueil</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  flexGreen: { flex: 1, backgroundColor: PRIMARY },
  safeGreen: { flex: 1, backgroundColor: PRIMARY },
  pressed: { opacity: 0.8 },

  // Login
  loginTop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? 60 : 80,
    paddingBottom: 24,
    paddingHorizontal: 28,
  },
  loginLogo: { fontSize: 38, fontWeight: '800', color: '#FFF', marginBottom: 10 },
  loginSlogan: {
    fontSize: 15,
    color: '#C8E6C9',
    textAlign: 'center',
    lineHeight: 22,
  },
  loginCard: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    paddingBottom: Platform.OS === 'android' ? 40 : 28,
  },
  loginCardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  loginFooter: {
    fontSize: 11,
    color: '#BDBDBD',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 16,
  },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 14 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#EEEEEE' },
  dividerLabel: { marginHorizontal: 12, color: '#BDBDBD', fontSize: 13 },

  // Inputs
  input: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 15,
    color: '#1A1A1A',
    backgroundColor: '#FAFAFA',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#616161',
    marginBottom: 6,
    marginTop: 2,
  },
  textarea: { height: 100, textAlignVertical: 'top', paddingTop: 12 },

  // Boutons
  btnPrimary: {
    backgroundColor: PRIMARY,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  btnPrimaryText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnOutlineText: { color: PRIMARY, fontSize: 16, fontWeight: '700' },

  // Home
  homeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 14 : 8,
    paddingBottom: 14,
  },
  homeGreet: { fontSize: 13, color: '#A5D6A7', fontWeight: '500', marginBottom: 2 },
  homeTitle: { fontSize: 26, fontWeight: '800', color: '#FFF' },
  countBadge: {
    backgroundColor: ACCENT,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  countBadgeText: { color: '#FFF', fontWeight: '700', fontSize: 13 },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  searchIconTxt: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 12, color: '#1A1A1A' },
  clearBtn: { fontSize: 16, color: '#9E9E9E', paddingLeft: 8 },

  // Catégories
  catsScroll: { maxHeight: 46, backgroundColor: PRIMARY },
  catsContent: { paddingHorizontal: 16, paddingBottom: 8, gap: 8, alignItems: 'flex-start' },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  chipOn: { backgroundColor: '#FFF' },
  chipTxt: { color: 'rgba(255,255,255,0.88)', fontSize: 13, fontWeight: '600' },
  chipTxtOn: { color: PRIMARY },

  // Liste
  listScroll: { flex: 1, backgroundColor: BG },
  listContent: { padding: 16, gap: 10 },
  emptyTxt: { textAlign: 'center', color: '#9E9E9E', marginTop: 50, fontSize: 15 },

  // Carte produit
  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  cardRight: { alignItems: 'flex-end' },
  cardIcon: { fontSize: 36 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 2 },
  cardUnit: { fontSize: 12, color: '#757575', marginBottom: 5 },
  catPill: {
    backgroundColor: '#E8F5E9',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  catPillTxt: { fontSize: 10, color: PRIMARY, fontWeight: '700' },
  cardPrice: { fontSize: 18, fontWeight: '800', color: PRIMARY },
  cardTrend: { fontSize: 12, fontWeight: '600', marginTop: 3 },
  bellBadge: { fontSize: 14, marginTop: 4 },

  // Sub-header (détail, signalement)
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 14 : 8,
    paddingBottom: 14,
    backgroundColor: PRIMARY,
  },
  subHeaderTitle: { fontSize: 17, fontWeight: '700', color: '#FFF' },
  backBtn: { paddingVertical: 6 },
  backBtnTxt: { color: '#FFF', fontSize: 15, fontWeight: '600' },

  // Détail hero
  detailHero: {
    backgroundColor: PRIMARY,
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  detailHeroIcon: { fontSize: 60, marginBottom: 10 },
  detailHeroName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  detailHeroUnit: { fontSize: 13, color: '#C8E6C9' },
  detailCatPill: {
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  detailCatPillTxt: { color: '#FFF', fontSize: 12, fontWeight: '700' },

  // Bloc prix
  priceBlock: {
    backgroundColor: '#FFF',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  priceBlockRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  priceBlockLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9E9E9E',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  priceBlockValue: { fontSize: 30, fontWeight: '800', color: PRIMARY },
  variationChip: { borderRadius: 10, padding: 10, alignItems: 'center' },
  variationChipVal: { fontSize: 16, fontWeight: '800' },
  variationChipLbl: { fontSize: 10, fontWeight: '600' },
  priceBlockPrev: { fontSize: 13, color: '#BDBDBD', marginTop: 10, fontStyle: 'italic' },

  // Section
  section: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 10 },
  sectionBody: { fontSize: 14, color: '#616161', lineHeight: 22 },

  // Alerte
  alerteRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  // Historique
  histRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  histDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12, flexShrink: 0 },
  histMid: { flex: 1 },
  histDate: { fontSize: 12, color: '#9E9E9E', marginBottom: 2 },
  histPrice: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  histChange: { fontSize: 13, fontWeight: '700' },

  // Bouton signalement
  reportBtn: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FFF3F3',
    borderWidth: 1.5,
    borderColor: DANGER,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  reportBtnTxt: { color: DANGER, fontSize: 15, fontWeight: '700' },

  // Report hero
  reportHero: {
    backgroundColor: PRIMARY,
    alignItems: 'center',
    padding: 28,
  },
  reportHeroIcon: { fontSize: 48, marginBottom: 10 },
  reportHeroTitle: { fontSize: 20, fontWeight: '800', color: '#FFF', marginBottom: 8 },
  reportHeroSub: { fontSize: 13, color: '#C8E6C9', textAlign: 'center', lineHeight: 22 },

  // Confirmation
  confirmRoot: { backgroundColor: BG, justifyContent: 'center', alignItems: 'center' },
  confirmCard: {
    backgroundColor: '#FFF',
    margin: 24,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    width: '88%',
  },
  confirmEmoji: { fontSize: 70, marginBottom: 16 },
  confirmTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', marginBottom: 12 },
  confirmBody: {
    fontSize: 14,
    color: '#616161',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  confirmRefBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  confirmRefLabel: { fontSize: 11, color: '#757575', fontWeight: '600', marginBottom: 4 },
  confirmRefValue: { fontSize: 18, fontWeight: '800', color: PRIMARY },
});
