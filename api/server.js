var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [
    "postgresqlExtensions"
  ],
  "clientVersion": "7.7.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id            String           @id\n  name          String\n  email         String           @unique\n  emailVerified Boolean          @default(false)\n  image         String?\n  bgimage       String?          @default("https://images.pexels.com/photos/8250184/pexels-photo-8250184.jpeg")\n  phone         String?          @db.VarChar(15)\n  role          Role             @default(Customer)\n  status        Status           @default(activate)\n  isActive      Boolean          @default(true)\n  createdAt     DateTime         @default(now())\n  updatedAt     DateTime         @updatedAt\n  accounts      Account[]\n  category      Category[]\n  payments      Payment[]\n  orders        Order[]\n  provider      ProviderProfile?\n  reviews       Review[]\n  sessions      Session[]\n  highlights    Highlight[]\n  blogs         Blog[]\n  newsletter    Newsletter[]\n\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String   @unique\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum Role {\n  Customer\n  Provider\n  Admin\n}\n\nenum Status {\n  activate\n  suspend\n}\n\nmodel Blog {\n  id String @id @default(cuid())\n\n  title    String\n  content  String\n  images   String[]\n  authorId String\n  author   User     @relation(fields: [authorId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  mealid   String\n  meal     Meal?    @relation(fields: [mealid], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Category {\n  id        String   @id @default(uuid())\n  adminId   String\n  name      String   @unique @db.VarChar(150)\n  image     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  user      User     @relation(fields: [adminId], references: [id], onDelete: Cascade)\n  meals     Meal[]\n\n  @@map("categories")\n}\n\nenum PaymentStatus {\n  PAID\n  UNPAID\n  FREE\n}\n\nmodel Highlight {\n  id String @id @default(cuid())\n\n  title       String\n  description String\n  image       String?\n  userId      String\n  user        User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("highlight")\n}\n\nmodel Meal {\n  id                String            @id @default(uuid())\n  title             String            @db.VarChar(100)\n  description       String?\n  images            String[]\n  price             Int\n  date              DateTime\n  location          String\n  isAvailable       Boolean           @default(true)\n  dietaryPreference DietaryPreference @default(HALAL)\n  providerId        String\n  category_name     String\n  deliverycharge    Int\n  cuisine           Cuisine           @default(BANGLEDESHI)\n  status            MealsStatus       @default(APPROVED)\n  createdAt         DateTime          @default(now())\n  updatedAt         DateTime          @updatedAt\n  category          Category          @relation(fields: [category_name], references: [name], onDelete: Cascade)\n  provider          ProviderProfile   @relation(fields: [providerId], references: [id], onDelete: Cascade)\n  orderitem         Orderitem[]\n  reviews           Review[]\n  payment           Payment[]\n  blogs             Blog[]\n\n  @@map("meal")\n}\n\nenum DietaryPreference {\n  HALAL\n  VEGAN\n  VEGETARIAN\n  ANY\n  GLUTEN_FREE\n  KETO\n  PALEO\n  DAIRY_FREE\n  NUT_FREE\n  LOW_SUGAR\n}\n\nenum Cuisine {\n  BANGLEDESHI\n  ITALIAN\n  CHINESE\n  INDIAN\n  MEXICAN\n  THAI\n  JAPANESE\n  FRENCH\n  MEDITERRANEAN\n  AMERICAN\n  MIDDLE_EASTERN\n}\n\nenum MealsStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nmodel Newsletter {\n  id String @id @default(cuid())\n\n  email     String   @unique\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([userId])\n  @@map("newsletter")\n}\n\nmodel Order {\n  id            String          @id @default(uuid())\n  customerId    String\n  providerId    String\n  first_name    String?\n  last_name     String?\n  status        OrderStatus     @default(PLACED)\n  totalPrice    Int\n  phone         String?\n  address       String\n  createdAt     DateTime        @default(now())\n  updatedAt     DateTime        @updatedAt\n  customer      User            @relation(fields: [customerId], references: [id], onDelete: Cascade)\n  provider      ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)\n  orderitem     Orderitem[]\n  payment       Payment?\n  paymentStatus PaymentStatus   @default(UNPAID)\n\n  @@map("order")\n}\n\nmodel Orderitem {\n  id        String   @id @default(uuid())\n  orderId   String\n  price     Float\n  quantity  Int\n  mealId    String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  meal      Meal     @relation(fields: [mealId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)\n\n  @@map("orderitem")\n}\n\nenum OrderStatus {\n  PLACED\n  PREPARING\n  READY\n  DELIVERED\n  CANCELLED\n}\n\nmodel Payment {\n  id String @id @default(uuid())\n\n  userId             String\n  mealId             String\n  stripeEventId      String? @unique\n  transactionId      String? @unique @db.Uuid()\n  paymentGatewayData Json?\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  meal Meal @relation(fields: [mealId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  amount  Float\n  status  PaymentStatus @default(UNPAID)\n  orderId String        @unique\n  order   Order         @relation(fields: [orderId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n}\n\nmodel ProviderProfile {\n  id             String   @id @default(uuid())\n  userId         String   @unique\n  restaurantName String   @unique @db.VarChar(100)\n  address        String   @db.VarChar(200)\n  description    String?\n  image          String?  @db.VarChar(100)\n  createdAt      DateTime @default(now())\n  updatedAt      DateTime @updatedAt\n  meals          Meal[]\n  orders         Order[]\n  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map("providerprofile")\n}\n\nmodel DocumentEmbedding {\n  id String @id @default(uuid(7))\n\n  chunkKey    String  @unique\n  sourceType  String\n  sourceId    String\n  sourceLabel String?\n  content     String\n  metadata    Json?\n\n  embedding Unsupported("vector(2048)")\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n\n  @@index([sourceType], name: "idx_document_embeddings_sourceType")\n  @@index([sourceId], name: "idx_document_embeddings_sourceId")\n  @@map("document_embeddings")\n}\n\nmodel Review {\n  id         String       @id @default(uuid())\n  customerId String\n  mealId     String\n  parentId   String?\n  rating     Int\n  status     ReviewStatus @default(APPROVED)\n  comment    String\n  createdAt  DateTime     @default(now())\n  updatedAt  DateTime     @updatedAt\n  customer   User         @relation(fields: [customerId], references: [id], onDelete: Cascade)\n  meal       Meal         @relation(fields: [mealId], references: [id], onDelete: Cascade)\n  parent     Review?      @relation("reviewsReply", fields: [parentId], references: [id], onDelete: Cascade)\n  replies    Review[]     @relation("reviewsReply")\n\n  @@map("review")\n}\n\nenum ReviewStatus {\n  APPROVED\n  REJECTED\n}\n\ngenerator client {\n  provider        = "prisma-client"\n  output          = "../../src/generated/prisma"\n  previewFeatures = ["postgresqlExtensions"]\n}\n\ndatasource db {\n  provider   = "postgresql"\n  extensions = [vector]\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"bgimage","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"Status"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"ProviderProfileToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"highlights","kind":"object","type":"Highlight","relationName":"HighlightToUser"},{"name":"blogs","kind":"object","type":"Blog","relationName":"BlogToUser"},{"name":"newsletter","kind":"object","type":"Newsletter","relationName":"NewsletterToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Blog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"images","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"author","kind":"object","type":"User","relationName":"BlogToUser"},{"name":"mealid","kind":"scalar","type":"String"},{"name":"meal","kind":"object","type":"Meal","relationName":"BlogToMeal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"CategoryToUser"},{"name":"meals","kind":"object","type":"Meal","relationName":"CategoryToMeal"}],"dbName":"categories"},"Highlight":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"HighlightToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"highlight"},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"images","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Int"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"location","kind":"scalar","type":"String"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"dietaryPreference","kind":"enum","type":"DietaryPreference"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"category_name","kind":"scalar","type":"String"},{"name":"deliverycharge","kind":"scalar","type":"Int"},{"name":"cuisine","kind":"enum","type":"Cuisine"},{"name":"status","kind":"enum","type":"MealsStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMeal"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"MealToProviderProfile"},{"name":"orderitem","kind":"object","type":"Orderitem","relationName":"MealToOrderitem"},{"name":"reviews","kind":"object","type":"Review","relationName":"MealToReview"},{"name":"payment","kind":"object","type":"Payment","relationName":"MealToPayment"},{"name":"blogs","kind":"object","type":"Blog","relationName":"BlogToMeal"}],"dbName":"meal"},"Newsletter":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NewsletterToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"newsletter"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"first_name","kind":"scalar","type":"String"},{"name":"last_name","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"totalPrice","kind":"scalar","type":"Int"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"OrderToProviderProfile"},{"name":"orderitem","kind":"object","type":"Orderitem","relationName":"OrderToOrderitem"},{"name":"payment","kind":"object","type":"Payment","relationName":"OrderToPayment"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"}],"dbName":"order"},"Orderitem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToOrderitem"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderitem"}],"dbName":"orderitem"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"stripeEventId","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"paymentGatewayData","kind":"scalar","type":"Json"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToPayment"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"ProviderProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"restaurantName","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"meals","kind":"object","type":"Meal","relationName":"MealToProviderProfile"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToProviderProfile"},{"name":"user","kind":"object","type":"User","relationName":"ProviderProfileToUser"}],"dbName":"providerprofile"},"DocumentEmbedding":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"chunkKey","kind":"scalar","type":"String"},{"name":"sourceType","kind":"scalar","type":"String"},{"name":"sourceId","kind":"scalar","type":"String"},{"name":"sourceLabel","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"document_embeddings"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"ReviewStatus"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToReview"},{"name":"parent","kind":"object","type":"Review","relationName":"reviewsReply"},{"name":"replies","kind":"object","type":"Review","relationName":"reviewsReply"}],"dbName":"review"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","accounts","category","meals","customer","provider","meal","order","orderitem","payment","_count","orders","parent","replies","reviews","author","blogs","payments","sessions","highlights","newsletter","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Blog.findUnique","Blog.findUniqueOrThrow","Blog.findFirst","Blog.findFirstOrThrow","Blog.findMany","Blog.createOne","Blog.createMany","Blog.createManyAndReturn","Blog.updateOne","Blog.updateMany","Blog.updateManyAndReturn","Blog.upsertOne","Blog.deleteOne","Blog.deleteMany","Blog.groupBy","Blog.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Highlight.findUnique","Highlight.findUniqueOrThrow","Highlight.findFirst","Highlight.findFirstOrThrow","Highlight.findMany","Highlight.createOne","Highlight.createMany","Highlight.createManyAndReturn","Highlight.updateOne","Highlight.updateMany","Highlight.updateManyAndReturn","Highlight.upsertOne","Highlight.deleteOne","Highlight.deleteMany","Highlight.groupBy","Highlight.aggregate","Meal.findUnique","Meal.findUniqueOrThrow","Meal.findFirst","Meal.findFirstOrThrow","Meal.findMany","Meal.createOne","Meal.createMany","Meal.createManyAndReturn","Meal.updateOne","Meal.updateMany","Meal.updateManyAndReturn","Meal.upsertOne","Meal.deleteOne","Meal.deleteMany","_avg","_sum","Meal.groupBy","Meal.aggregate","Newsletter.findUnique","Newsletter.findUniqueOrThrow","Newsletter.findFirst","Newsletter.findFirstOrThrow","Newsletter.findMany","Newsletter.createOne","Newsletter.createMany","Newsletter.createManyAndReturn","Newsletter.updateOne","Newsletter.updateMany","Newsletter.updateManyAndReturn","Newsletter.upsertOne","Newsletter.deleteOne","Newsletter.deleteMany","Newsletter.groupBy","Newsletter.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","Orderitem.findUnique","Orderitem.findUniqueOrThrow","Orderitem.findFirst","Orderitem.findFirstOrThrow","Orderitem.findMany","Orderitem.createOne","Orderitem.createMany","Orderitem.createManyAndReturn","Orderitem.updateOne","Orderitem.updateMany","Orderitem.updateManyAndReturn","Orderitem.upsertOne","Orderitem.deleteOne","Orderitem.deleteMany","Orderitem.groupBy","Orderitem.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","ProviderProfile.findUnique","ProviderProfile.findUniqueOrThrow","ProviderProfile.findFirst","ProviderProfile.findFirstOrThrow","ProviderProfile.findMany","ProviderProfile.createOne","ProviderProfile.createMany","ProviderProfile.createManyAndReturn","ProviderProfile.updateOne","ProviderProfile.updateMany","ProviderProfile.updateManyAndReturn","ProviderProfile.upsertOne","ProviderProfile.deleteOne","ProviderProfile.deleteMany","ProviderProfile.groupBy","ProviderProfile.aggregate","DocumentEmbedding.findUnique","DocumentEmbedding.findUniqueOrThrow","DocumentEmbedding.findFirst","DocumentEmbedding.findFirstOrThrow","DocumentEmbedding.findMany","DocumentEmbedding.updateOne","DocumentEmbedding.updateMany","DocumentEmbedding.updateManyAndReturn","DocumentEmbedding.deleteOne","DocumentEmbedding.deleteMany","DocumentEmbedding.groupBy","DocumentEmbedding.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","AND","OR","NOT","id","customerId","mealId","parentId","rating","ReviewStatus","status","comment","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","chunkKey","sourceType","sourceId","sourceLabel","content","metadata","isDeleted","deletedAt","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","userId","restaurantName","address","description","image","every","some","none","stripeEventId","transactionId","paymentGatewayData","amount","PaymentStatus","orderId","price","quantity","providerId","first_name","last_name","OrderStatus","totalPrice","phone","paymentStatus","email","title","images","date","location","isAvailable","DietaryPreference","dietaryPreference","category_name","deliverycharge","Cuisine","cuisine","MealsStatus","has","hasEvery","hasSome","adminId","name","authorId","mealid","identifier","value","expiresAt","accountId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","emailVerified","bgimage","Role","role","Status","isActive","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "hAiIAewBGQQAAO8DACAFAADwAwAgCAAA8gMAIA4AAMMDACARAADzAwAgEwAA9gMAIBQAAPEDACAVAAD0AwAgFgAA9QMAIBcAAPcDACCMAgAA7AMAMI0CAABOABCOAgAA7AMAMI8CAQAAAAGVAgAA7gPwAiKXAkAAvwMAIZgCQAC_AwAhtgIBALsDACHHAgEAuwMAIckCAQAAAAHaAgEAugMAIesCIAC9AwAh7AIBALsDACHuAgAA7QPuAiLwAiAAvQMAIQEAAAABACARAwAAxAMAIIwCAACUBAAwjQIAAAMAEI4CAACUBAAwjwIBALoDACGXAkAAvwMAIZgCQAC_AwAhsgIBALoDACHCAgEAugMAIeACAQC6AwAh4QIBALsDACHiAgEAuwMAIeMCAQC7AwAh5AJAAL4DACHlAkAAvgMAIeYCAQC7AwAh5wIBALsDACEIAwAAvQUAIOECAACVBAAg4gIAAJUEACDjAgAAlQQAIOQCAACVBAAg5QIAAJUEACDmAgAAlQQAIOcCAACVBAAgEQMAAMQDACCMAgAAlAQAMI0CAAADABCOAgAAlAQAMI8CAQAAAAGXAkAAvwMAIZgCQAC_AwAhsgIBALoDACHCAgEAugMAIeACAQC6AwAh4QIBALsDACHiAgEAuwMAIeMCAQC7AwAh5AJAAL4DACHlAkAAvgMAIeYCAQC7AwAh5wIBALsDACEDAAAAAwAgAQAABAAwAgAABQAgCwMAAMQDACAGAADCAwAgjAIAAJMEADCNAgAABwAQjgIAAJMEADCPAgEAugMAIZcCQAC_AwAhmAJAAL8DACG2AgEAugMAIdkCAQC6AwAh2gIBALoDACECAwAAvQUAIAYAALsFACALAwAAxAMAIAYAAMIDACCMAgAAkwQAMI0CAAAHABCOAgAAkwQAMI8CAQAAAAGXAkAAvwMAIZgCQAC_AwAhtgIBALoDACHZAgEAugMAIdoCAQAAAAEDAAAABwAgAQAACAAwAgAACQAgGQUAAJIEACAIAACLBAAgCwAAjAQAIAwAAPEDACARAADzAwAgEwAA9gMAIIwCAACOBAAwjQIAAAsAEI4CAACOBAAwjwIBALoDACGVAgAAkQTWAiKXAkAAvwMAIZgCQAC_AwAhtQIBALsDACHAAgIAgwQAIcICAQC6AwAhygIBALoDACHLAgAA1AMAIMwCQAC_AwAhzQIBALoDACHOAiAAvQMAIdACAACPBNACItECAQC6AwAh0gICAIMEACHUAgAAkATUAiIHBQAAjgcAIAgAAIMHACALAACMBwAgDAAAggcAIBEAAIQHACATAACHBwAgtQIAAJUEACAZBQAAkgQAIAgAAIsEACALAACMBAAgDAAA8QMAIBEAAPMDACATAAD2AwAgjAIAAI4EADCNAgAACwAQjgIAAI4EADCPAgEAAAABlQIAAJEE1gIilwJAAL8DACGYAkAAvwMAIbUCAQC7AwAhwAICAIMEACHCAgEAugMAIcoCAQC6AwAhywIAANQDACDMAkAAvwMAIc0CAQC6AwAhzgIgAL0DACHQAgAAjwTQAiLRAgEAugMAIdICAgCDBAAh1AIAAJAE1AIiAwAAAAsAIAEAAAwAMAIAAA0AIAMAAAALACABAAAMADACAAANACATBwAAxAMAIAgAAIsEACALAACMBAAgDAAAjQQAIIwCAACJBAAwjQIAABAAEI4CAACJBAAwjwIBALoDACGQAgEAugMAIZUCAACKBMYCIpcCQAC_AwAhmAJAAL8DACG0AgEAugMAIcICAQC6AwAhwwIBALsDACHEAgEAuwMAIcYCAgCDBAAhxwIBALsDACHIAgAA_wO_AiIHBwAAvQUAIAgAAIMHACALAACMBwAgDAAAjQcAIMMCAACVBAAgxAIAAJUEACDHAgAAlQQAIBMHAADEAwAgCAAAiwQAIAsAAIwEACAMAACNBAAgjAIAAIkEADCNAgAAEAAQjgIAAIkEADCPAgEAAAABkAIBALoDACGVAgAAigTGAiKXAkAAvwMAIZgCQAC_AwAhtAIBALoDACHCAgEAugMAIcMCAQC7AwAhxAIBALsDACHGAgIAgwQAIccCAQC7AwAhyAIAAP8DvwIiAwAAABAAIAEAABEAMAIAABIAIAwJAACABAAgCgAAgQQAIIwCAACIBAAwjQIAABQAEI4CAACIBAAwjwIBALoDACGRAgEAugMAIZcCQAC_AwAhmAJAAL8DACG_AgEAugMAIcACCAD-AwAhwQICAIMEACECCQAAiQcAIAoAAIoHACAMCQAAgAQAIAoAAIEEACCMAgAAiAQAMI0CAAAUABCOAgAAiAQAMI8CAQAAAAGRAgEAugMAIZcCQAC_AwAhmAJAAL8DACG_AgEAugMAIcACCAD-AwAhwQICAIMEACEDAAAAFAAgAQAAFQAwAgAAFgAgEAMAAMQDACAJAACABAAgCgAAgQQAIIwCAAD9AwAwjQIAABgAEI4CAAD9AwAwjwIBALoDACGRAgEAugMAIZUCAAD_A78CIpcCQAC_AwAhsgIBALoDACG6AgEAuwMAIbsCAQCGBAAhvAIAALwDACC9AggA_gMAIb8CAQC6AwAhAQAAABgAIAEAAAAUACABAAAACwAgAQAAABAAIAMAAAAUACABAAAVADACAAAWACAQBwAAxAMAIAkAAIAEACAPAACFBAAgEAAA8wMAIIwCAACCBAAwjQIAAB4AEI4CAACCBAAwjwIBALoDACGQAgEAugMAIZECAQC6AwAhkgIBALsDACGTAgIAgwQAIZUCAACEBJUCIpYCAQC6AwAhlwJAAL8DACGYAkAAvwMAIQUHAAC9BQAgCQAAiQcAIA8AAIsHACAQAACEBwAgkgIAAJUEACAQBwAAxAMAIAkAAIAEACAPAACFBAAgEAAA8wMAIIwCAACCBAAwjQIAAB4AEI4CAACCBAAwjwIBAAAAAZACAQC6AwAhkQIBALoDACGSAgEAuwMAIZMCAgCDBAAhlQIAAIQElQIilgIBALoDACGXAkAAvwMAIZgCQAC_AwAhAwAAAB4AIAEAAB8AMAIAACAAIAEAAAAeACADAAAAHgAgAQAAHwAwAgAAIAAgAQAAAB4AIAYDAAC9BQAgCQAAiQcAIAoAAIoHACC6AgAAlQQAILsCAACVBAAgvAIAAJUEACAQAwAAxAMAIAkAAIAEACAKAACBBAAgjAIAAP0DADCNAgAAGAAQjgIAAP0DADCPAgEAAAABkQIBALoDACGVAgAA_wO_AiKXAkAAvwMAIbICAQC6AwAhugIBAAAAAbsCAQAAAAG8AgAAvAMAIL0CCAD-AwAhvwIBAAAAAQMAAAAYACABAAAlADACAAAmACANCQAA_AMAIBIAAMQDACCMAgAA-wMAMI0CAAAoABCOAgAA-wMAMI8CAQC6AwAhlwJAAL8DACGYAkAAvwMAIagCAQC6AwAhygIBALoDACHLAgAA1AMAINsCAQC6AwAh3AIBALoDACECCQAAiQcAIBIAAL0FACANCQAA_AMAIBIAAMQDACCMAgAA-wMAMI0CAAAoABCOAgAA-wMAMI8CAQAAAAGXAkAAvwMAIZgCQAC_AwAhqAIBALoDACHKAgEAugMAIcsCAADUAwAg2wIBALoDACHcAgEAugMAIQMAAAAoACABAAApADACAAAqACABAAAACwAgAQAAABQAIAEAAAAeACABAAAAGAAgAQAAACgAIAEAAAALACADAAAAGAAgAQAAJQAwAgAAJgAgAwAAABAAIAEAABEAMAIAABIAIA4DAADEAwAgBgAAwgMAIA4AAMMDACCMAgAAwQMAMI0CAAA0ABCOAgAAwQMAMI8CAQC6AwAhlwJAAL8DACGYAkAAvwMAIbICAQC6AwAhswIBALoDACG0AgEAugMAIbUCAQC7AwAhtgIBALsDACEBAAAANAAgAwAAAB4AIAEAAB8AMAIAACAAIAwDAADEAwAgjAIAAPoDADCNAgAANwAQjgIAAPoDADCPAgEAugMAIZcCQAC_AwAhmAJAAL8DACGyAgEAugMAId8CQAC_AwAh6AIBALoDACHpAgEAuwMAIeoCAQC7AwAhAwMAAL0FACDpAgAAlQQAIOoCAACVBAAgDAMAAMQDACCMAgAA-gMAMI0CAAA3ABCOAgAA-gMAMI8CAQAAAAGXAkAAvwMAIZgCQAC_AwAhsgIBALoDACHfAkAAvwMAIegCAQAAAAHpAgEAuwMAIeoCAQC7AwAhAwAAADcAIAEAADgAMAIAADkAIAsDAADEAwAgjAIAAPkDADCNAgAAOwAQjgIAAPkDADCPAgEAugMAIZcCQAC_AwAhmAJAAL8DACGyAgEAugMAIbUCAQC6AwAhtgIBALsDACHKAgEAugMAIQIDAAC9BQAgtgIAAJUEACALAwAAxAMAIIwCAAD5AwAwjQIAADsAEI4CAAD5AwAwjwIBAAAAAZcCQAC_AwAhmAJAAL8DACGyAgEAugMAIbUCAQC6AwAhtgIBALsDACHKAgEAugMAIQMAAAA7ACABAAA8ADACAAA9ACADAAAAKAAgAQAAKQAwAgAAKgAgCQMAAMQDACCMAgAA-AMAMI0CAABAABCOAgAA-AMAMI8CAQC6AwAhlwJAAL8DACGYAkAAvwMAIbICAQC6AwAhyQIBALoDACEBAwAAvQUAIAkDAADEAwAgjAIAAPgDADCNAgAAQAAQjgIAAPgDADCPAgEAAAABlwJAAL8DACGYAkAAvwMAIbICAQC6AwAhyQIBAAAAAQMAAABAACABAABBADACAABCACABAAAAAwAgAQAAAAcAIAEAAAAYACABAAAAEAAgAQAAAB4AIAEAAAA3ACABAAAAOwAgAQAAACgAIAEAAABAACABAAAAAQAgGQQAAO8DACAFAADwAwAgCAAA8gMAIA4AAMMDACARAADzAwAgEwAA9gMAIBQAAPEDACAVAAD0AwAgFgAA9QMAIBcAAPcDACCMAgAA7AMAMI0CAABOABCOAgAA7AMAMI8CAQC6AwAhlQIAAO4D8AIilwJAAL8DACGYAkAAvwMAIbYCAQC7AwAhxwIBALsDACHJAgEAugMAIdoCAQC6AwAh6wIgAL0DACHsAgEAuwMAIe4CAADtA-4CIvACIAC9AwAhDQQAAIAHACAFAACBBwAgCAAAgwcAIA4AALwFACARAACEBwAgEwAAhwcAIBQAAIIHACAVAACFBwAgFgAAhgcAIBcAAIgHACC2AgAAlQQAIMcCAACVBAAg7AIAAJUEACADAAAATgAgAQAATwAwAgAAAQAgAwAAAE4AIAEAAE8AMAIAAAEAIAMAAABOACABAABPADACAAABACAWBAAA9gYAIAUAAPcGACAIAAD6BgAgDgAA-QYAIBEAAPsGACATAAD-BgAgFAAA-AYAIBUAAPwGACAWAAD9BgAgFwAA_wYAII8CAQAAAAGVAgAAAPACApcCQAAAAAGYAkAAAAABtgIBAAAAAccCAQAAAAHJAgEAAAAB2gIBAAAAAesCIAAAAAHsAgEAAAAB7gIAAADuAgLwAiAAAAABAR0AAFMAIAyPAgEAAAABlQIAAADwAgKXAkAAAAABmAJAAAAAAbYCAQAAAAHHAgEAAAAByQIBAAAAAdoCAQAAAAHrAiAAAAAB7AIBAAAAAe4CAAAA7gIC8AIgAAAAAQEdAABVADABHQAAVQAwFgQAAIcGACAFAACIBgAgCAAAiwYAIA4AAIoGACARAACMBgAgEwAAjwYAIBQAAIkGACAVAACNBgAgFgAAjgYAIBcAAJAGACCPAgEAmwQAIZUCAACGBvACIpcCQACeBAAhmAJAAJ4EACG2AgEAnwQAIccCAQCfBAAhyQIBAJsEACHaAgEAmwQAIesCIAC3BAAh7AIBAJ8EACHuAgAAhQbuAiLwAiAAtwQAIQIAAAABACAdAABYACAMjwIBAJsEACGVAgAAhgbwAiKXAkAAngQAIZgCQACeBAAhtgIBAJ8EACHHAgEAnwQAIckCAQCbBAAh2gIBAJsEACHrAiAAtwQAIewCAQCfBAAh7gIAAIUG7gIi8AIgALcEACECAAAATgAgHQAAWgAgAgAAAE4AIB0AAFoAIAMAAAABACAkAABTACAlAABYACABAAAAAQAgAQAAAE4AIAYNAACCBgAgKgAAhAYAICsAAIMGACC2AgAAlQQAIMcCAACVBAAg7AIAAJUEACAPjAIAAOUDADCNAgAAYQAQjgIAAOUDADCPAgEAnwMAIZUCAADnA_ACIpcCQACjAwAhmAJAAKMDACG2AgEAoAMAIccCAQCgAwAhyQIBAJ8DACHaAgEAnwMAIesCIACyAwAh7AIBAKADACHuAgAA5gPuAiLwAiAAsgMAIQMAAABOACABAABgADApAABhACADAAAATgAgAQAATwAwAgAAAQAgAQAAADkAIAEAAAA5ACADAAAANwAgAQAAOAAwAgAAOQAgAwAAADcAIAEAADgAMAIAADkAIAMAAAA3ACABAAA4ADACAAA5ACAJAwAAgQYAII8CAQAAAAGXAkAAAAABmAJAAAAAAbICAQAAAAHfAkAAAAAB6AIBAAAAAekCAQAAAAHqAgEAAAABAR0AAGkAIAiPAgEAAAABlwJAAAAAAZgCQAAAAAGyAgEAAAAB3wJAAAAAAegCAQAAAAHpAgEAAAAB6gIBAAAAAQEdAABrADABHQAAawAwCQMAAIAGACCPAgEAmwQAIZcCQACeBAAhmAJAAJ4EACGyAgEAmwQAId8CQACeBAAh6AIBAJsEACHpAgEAnwQAIeoCAQCfBAAhAgAAADkAIB0AAG4AIAiPAgEAmwQAIZcCQACeBAAhmAJAAJ4EACGyAgEAmwQAId8CQACeBAAh6AIBAJsEACHpAgEAnwQAIeoCAQCfBAAhAgAAADcAIB0AAHAAIAIAAAA3ACAdAABwACADAAAAOQAgJAAAaQAgJQAAbgAgAQAAADkAIAEAAAA3ACAFDQAA_QUAICoAAP8FACArAAD-BQAg6QIAAJUEACDqAgAAlQQAIAuMAgAA5AMAMI0CAAB3ABCOAgAA5AMAMI8CAQCfAwAhlwJAAKMDACGYAkAAowMAIbICAQCfAwAh3wJAAKMDACHoAgEAnwMAIekCAQCgAwAh6gIBAKADACEDAAAANwAgAQAAdgAwKQAAdwAgAwAAADcAIAEAADgAMAIAADkAIAEAAAAFACABAAAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgDgMAAPwFACCPAgEAAAABlwJAAAAAAZgCQAAAAAGyAgEAAAABwgIBAAAAAeACAQAAAAHhAgEAAAAB4gIBAAAAAeMCAQAAAAHkAkAAAAAB5QJAAAAAAeYCAQAAAAHnAgEAAAABAR0AAH8AIA2PAgEAAAABlwJAAAAAAZgCQAAAAAGyAgEAAAABwgIBAAAAAeACAQAAAAHhAgEAAAAB4gIBAAAAAeMCAQAAAAHkAkAAAAAB5QJAAAAAAeYCAQAAAAHnAgEAAAABAR0AAIEBADABHQAAgQEAMA4DAAD7BQAgjwIBAJsEACGXAkAAngQAIZgCQACeBAAhsgIBAJsEACHCAgEAmwQAIeACAQCbBAAh4QIBAJ8EACHiAgEAnwQAIeMCAQCfBAAh5AJAALgEACHlAkAAuAQAIeYCAQCfBAAh5wIBAJ8EACECAAAABQAgHQAAhAEAIA2PAgEAmwQAIZcCQACeBAAhmAJAAJ4EACGyAgEAmwQAIcICAQCbBAAh4AIBAJsEACHhAgEAnwQAIeICAQCfBAAh4wIBAJ8EACHkAkAAuAQAIeUCQAC4BAAh5gIBAJ8EACHnAgEAnwQAIQIAAAADACAdAACGAQAgAgAAAAMAIB0AAIYBACADAAAABQAgJAAAfwAgJQAAhAEAIAEAAAAFACABAAAAAwAgCg0AAPgFACAqAAD6BQAgKwAA-QUAIOECAACVBAAg4gIAAJUEACDjAgAAlQQAIOQCAACVBAAg5QIAAJUEACDmAgAAlQQAIOcCAACVBAAgEIwCAADjAwAwjQIAAI0BABCOAgAA4wMAMI8CAQCfAwAhlwJAAKMDACGYAkAAowMAIbICAQCfAwAhwgIBAJ8DACHgAgEAnwMAIeECAQCgAwAh4gIBAKADACHjAgEAoAMAIeQCQACzAwAh5QJAALMDACHmAgEAoAMAIecCAQCgAwAhAwAAAAMAIAEAAIwBADApAACNAQAgAwAAAAMAIAEAAAQAMAIAAAUAIAmMAgAA4gMAMI0CAACTAQAQjgIAAOIDADCPAgEAAAABlwJAAL8DACGYAkAAvwMAId0CAQC6AwAh3gIBALoDACHfAkAAvwMAIQEAAACQAQAgAQAAAJABACAJjAIAAOIDADCNAgAAkwEAEI4CAADiAwAwjwIBALoDACGXAkAAvwMAIZgCQAC_AwAh3QIBALoDACHeAgEAugMAId8CQAC_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-gQAIAgAANkFACALAAD7BAAgDAAA_QQAIBEAAPwEACATAAD-BAAgjwIBAJsEACGVAgAA-ATWAiKXAkAAngQAIZgCQACeBAAhtQIBAJ8EACHAAgIAnAQAIcICAQCbBAAhygIBAJsEACHLAgAA9QQAIMwCQACeBAAhzQIBAJsEACHOAiAAtwQAIdACAAD2BNACItECAQCbBAAh0gICAJwEACHUAgAA9wTUAiICAAAADQAgHQAA9wEAIBCPAgEAmwQAIZUCAAD4BNYCIpcCQACeBAAhmAJAAJ4EACG1AgEAnwQAIcACAgCcBAAhwgIBAJsEACHKAgEAmwQAIcsCAAD1BAAgzAJAAJ4EACHNAgEAmwQAIc4CIAC3BAAh0AIAAPYE0AIi0QIBAJsEACHSAgIAnAQAIdQCAAD3BNQCIgIAAAALACAdAAD5AQAgAgAAAAsAIB0AAPkBACADAAAADQAgJAAA8gEAICUAAPcBACABAAAADQAgAQAAAAsAIAYNAADUBQAgKgAA1wUAICsAANYFACCcAQAA1QUAIJ0BAADYBQAgtQIAAJUEACATjAIAANMDADCNAgAAgAIAEI4CAADTAwAwjwIBAJ8DACGVAgAA1wPWAiKXAkAAowMAIZgCQACjAwAhtQIBAKADACHAAgIAoQMAIcICAQCfAwAhygIBAJ8DACHLAgAA1AMAIMwCQACjAwAhzQIBAJ8DACHOAiAAsgMAIdACAADVA9ACItECAQCfAwAh0gICAKEDACHUAgAA1gPUAiIDAAAACwAgAQAA_wEAMCkAAIACACADAAAACwAgAQAADAAwAgAADQAgAQAAAEIAIAEAAABCACADAAAAQAAgAQAAQQAwAgAAQgAgAwAAAEAAIAEAAEEAMAIAAEIAIAMAAABAACABAABBADACAABCACAGAwAA0wUAII8CAQAAAAGXAkAAAAABmAJAAAAAAbICAQAAAAHJAgEAAAABAR0AAIgCACAFjwIBAAAAAZcCQAAAAAGYAkAAAAABsgIBAAAAAckCAQAAAAEBHQAAigIAMAEdAACKAgAwBgMAANIFACCPAgEAmwQAIZcCQACeBAAhmAJAAJ4EACGyAgEAmwQAIckCAQCbBAAhAgAAAEIAIB0AAI0CACAFjwIBAJsEACGXAkAAngQAIZgCQACeBAAhsgIBAJsEACHJAgEAmwQAIQIAAABAACAdAACPAgAgAgAAAEAAIB0AAI8CACADAAAAQgAgJAAAiAIAICUAAI0CACABAAAAQgAgAQAAAEAAIAMNAADPBQAgKgAA0QUAICsAANAFACAIjAIAANIDADCNAgAAlgIAEI4CAADSAwAwjwIBAJ8DACGXAkAAowMAIZgCQACjAwAhsgIBAJ8DACHJAgEAnwMAIQMAAABAACABAACVAgAwKQAAlgIAIAMAAABAACABAABBADACAABCACABAAAAEgAgAQAAABIAIAMAAAAQACABAAARADACAAASACADAAAAEAAgAQAAEQAwAgAAEgAgAwAAABAAIAEAABEAMAIAABIAIBAHAADoBAAgCAAAzgUAIAsAAOkEACAMAADqBAAgjwIBAAAAAZACAQAAAAGVAgAAAMYCApcCQAAAAAGYAkAAAAABtAIBAAAAAcICAQAAAAHDAgEAAAABxAIBAAAAAcYCAgAAAAHHAgEAAAAByAIAAAC_AgIBHQAAngIAIAyPAgEAAAABkAIBAAAAAZUCAAAAxgIClwJAAAAAAZgCQAAAAAG0AgEAAAABwgIBAAAAAcMCAQAAAAHEAgEAAAABxgICAAAAAccCAQAAAAHIAgAAAL8CAgEdAACgAgAwAR0AAKACADAQBwAAzAQAIAgAAM0FACALAADNBAAgDAAAzgQAII8CAQCbBAAhkAIBAJsEACGVAgAAyQTGAiKXAkAAngQAIZgCQACeBAAhtAIBAJsEACHCAgEAmwQAIcMCAQCfBAAhxAIBAJ8EACHGAgIAnAQAIccCAQCfBAAhyAIAAMoEvwIiAgAAABIAIB0AAKMCACAMjwIBAJsEACGQAgEAmwQAIZUCAADJBMYCIpcCQACeBAAhmAJAAJ4EACG0AgEAmwQAIcICAQCbBAAhwwIBAJ8EACHEAgEAnwQAIcYCAgCcBAAhxwIBAJ8EACHIAgAAygS_AiICAAAAEAAgHQAApQIAIAIAAAAQACAdAAClAgAgAwAAABIAICQAAJ4CACAlAACjAgAgAQAAABIAIAEAAAAQACAIDQAAyAUAICoAAMsFACArAADKBQAgnAEAAMkFACCdAQAAzAUAIMMCAACVBAAgxAIAAJUEACDHAgAAlQQAIA-MAgAAzgMAMI0CAACsAgAQjgIAAM4DADCPAgEAnwMAIZACAQCfAwAhlQIAAM8DxgIilwJAAKMDACGYAkAAowMAIbQCAQCfAwAhwgIBAJ8DACHDAgEAoAMAIcQCAQCgAwAhxgICAKEDACHHAgEAoAMAIcgCAADIA78CIgMAAAAQACABAACrAgAwKQAArAIAIAMAAAAQACABAAARADACAAASACABAAAAFgAgAQAAABYAIAMAAAAUACABAAAVADACAAAWACADAAAAFAAgAQAAFQAwAgAAFgAgAwAAABQAIAEAABUAMAIAABYAIAkJAADmBAAgCgAAsAUAII8CAQAAAAGRAgEAAAABlwJAAAAAAZgCQAAAAAG_AgEAAAABwAIIAAAAAcECAgAAAAEBHQAAtAIAIAePAgEAAAABkQIBAAAAAZcCQAAAAAGYAkAAAAABvwIBAAAAAcACCAAAAAHBAgIAAAABAR0AALYCADABHQAAtgIAMAkJAADkBAAgCgAArgUAII8CAQCbBAAhkQIBAJsEACGXAkAAngQAIZgCQACeBAAhvwIBAJsEACHAAggA1AQAIcECAgCcBAAhAgAAABYAIB0AALkCACAHjwIBAJsEACGRAgEAmwQAIZcCQACeBAAhmAJAAJ4EACG_AgEAmwQAIcACCADUBAAhwQICAJwEACECAAAAFAAgHQAAuwIAIAIAAAAUACAdAAC7AgAgAwAAABYAICQAALQCACAlAAC5AgAgAQAAABYAIAEAAAAUACAFDQAAwwUAICoAAMYFACArAADFBQAgnAEAAMQFACCdAQAAxwUAIAqMAgAAzQMAMI0CAADCAgAQjgIAAM0DADCPAgEAnwMAIZECAQCfAwAhlwJAAKMDACGYAkAAowMAIb8CAQCfAwAhwAIIAMcDACHBAgIAoQMAIQMAAAAUACABAADBAgAwKQAAwgIAIAMAAAAUACABAAAVADACAAAWACABAAAAJgAgAQAAACYAIAMAAAAYACABAAAlADACAAAmACADAAAAGAAgAQAAJQAwAgAAJgAgAwAAABgAIAEAACUAMAIAACYAIA0DAADXBAAgCQAA2AQAIAoAAJwFACCPAgEAAAABkQIBAAAAAZUCAAAAvwIClwJAAAAAAbICAQAAAAG6AgEAAAABuwIBAAAAAbwCgAAAAAG9AggAAAABvwIBAAAAAQEdAADKAgAgCo8CAQAAAAGRAgEAAAABlQIAAAC_AgKXAkAAAAABsgIBAAAAAboCAQAAAAG7AgEAAAABvAKAAAAAAb0CCAAAAAG_AgEAAAABAR0AAMwCADABHQAAzAIAMA0DAADVBAAgCQAA1gQAIAoAAJoFACCPAgEAmwQAIZECAQCbBAAhlQIAAMoEvwIilwJAAJ4EACGyAgEAmwQAIboCAQCfBAAhuwIBAJ8EACG8AoAAAAABvQIIANQEACG_AgEAmwQAIQIAAAAmACAdAADPAgAgCo8CAQCbBAAhkQIBAJsEACGVAgAAygS_AiKXAkAAngQAIbICAQCbBAAhugIBAJ8EACG7AgEAnwQAIbwCgAAAAAG9AggA1AQAIb8CAQCbBAAhAgAAABgAIB0AANECACACAAAAGAAgHQAA0QIAIAMAAAAmACAkAADKAgAgJQAAzwIAIAEAAAAmACABAAAAGAAgCA0AAL4FACAqAADBBQAgKwAAwAUAIJwBAAC_BQAgnQEAAMIFACC6AgAAlQQAILsCAACVBAAgvAIAAJUEACANjAIAAMUDADCNAgAA2AIAEI4CAADFAwAwjwIBAJ8DACGRAgEAnwMAIZUCAADIA78CIpcCQACjAwAhsgIBAJ8DACG6AgEAoAMAIbsCAQDGAwAhvAIAALEDACC9AggAxwMAIb8CAQCfAwAhAwAAABgAIAEAANcCADApAADYAgAgAwAAABgAIAEAACUAMAIAACYAIA4DAADEAwAgBgAAwgMAIA4AAMMDACCMAgAAwQMAMI0CAAA0ABCOAgAAwQMAMI8CAQAAAAGXAkAAvwMAIZgCQAC_AwAhsgIBAAAAAbMCAQAAAAG0AgEAugMAIbUCAQC7AwAhtgIBALsDACEBAAAA2wIAIAEAAADbAgAgBQMAAL0FACAGAAC7BQAgDgAAvAUAILUCAACVBAAgtgIAAJUEACADAAAANAAgAQAA3gIAMAIAANsCACADAAAANAAgAQAA3gIAMAIAANsCACADAAAANAAgAQAA3gIAMAIAANsCACALAwAAugUAIAYAALgFACAOAAC5BQAgjwIBAAAAAZcCQAAAAAGYAkAAAAABsgIBAAAAAbMCAQAAAAG0AgEAAAABtQIBAAAAAbYCAQAAAAEBHQAA4gIAIAiPAgEAAAABlwJAAAAAAZgCQAAAAAGyAgEAAAABswIBAAAAAbQCAQAAAAG1AgEAAAABtgIBAAAAAQEdAADkAgAwAR0AAOQCADALAwAAvgQAIAYAALwEACAOAAC9BAAgjwIBAJsEACGXAkAAngQAIZgCQACeBAAhsgIBAJsEACGzAgEAmwQAIbQCAQCbBAAhtQIBAJ8EACG2AgEAnwQAIQIAAADbAgAgHQAA5wIAIAiPAgEAmwQAIZcCQACeBAAhmAJAAJ4EACGyAgEAmwQAIbMCAQCbBAAhtAIBAJsEACG1AgEAnwQAIbYCAQCfBAAhAgAAADQAIB0AAOkCACACAAAANAAgHQAA6QIAIAMAAADbAgAgJAAA4gIAICUAAOcCACABAAAA2wIAIAEAAAA0ACAFDQAAuQQAICoAALsEACArAAC6BAAgtQIAAJUEACC2AgAAlQQAIAuMAgAAwAMAMI0CAADwAgAQjgIAAMADADCPAgEAnwMAIZcCQACjAwAhmAJAAKMDACGyAgEAnwMAIbMCAQCfAwAhtAIBAJ8DACG1AgEAoAMAIbYCAQCgAwAhAwAAADQAIAEAAO8CADApAADwAgAgAwAAADQAIAEAAN4CADACAADbAgAgDowCAAC5AwAwjQIAAPYCABCOAgAAuQMAMI8CAQAAAAGXAkAAvwMAIZgCQAC_AwAhpAIBAAAAAaUCAQC6AwAhpgIBALoDACGnAgEAuwMAIagCAQC6AwAhqQIAALwDACCqAiAAvQMAIasCQAC-AwAhAQAAAPMCACABAAAA8wIAIA6MAgAAuQMAMI0CAAD2AgAQjgIAALkDADCPAgEAugMAIZcCQAC_AwAhmAJAAL8DACGkAgEAugMAIaUCAQC6AwAhpgIBALoDACGnAgEAuwMAIagCAQC6AwAhqQIAALwDACCqAiAAvQMAIasCQAC-AwAhA6cCAACVBAAgqQIAAJUEACCrAgAAlQQAIAMAAAD2AgAgAQAA9wIAMAIAAPMCACADAAAA9gIAIAEAAPcCADACAADzAgAgAwAAAPYCACABAAD3AgAwAgAA8wIAIAuPAgEAmwQAIZcCQACeBAAhmAJAAJ4EACGkAgEAmwQAIaUCAQCbBAAhpgIBAJsEACGnAgEAnwQAIagCAQCbBAAhqQKAAAAAAaoCIAC3BAAhqwJAALgEACECAAAA8wIAIB0AAPsCACALjwIBAJsEACGXAkAAngQAIZgCQACeBAAhpAIBAJsEACGlAgEAmwQAIaYCAQCbBAAhpwIBAJ8EACGoAgEAmwQAIakCgAAAAAGqAiAAtwQAIasCQAC4BAAhAgAAAPYCACAdAAD9AgAgAgAAAPYCACAdAAD9AgAgAQAAAPMCACABAAAA9gIAIAYNAAC0BAAgKgAAtgQAICsAALUEACCnAgAAlQQAIKkCAACVBAAgqwIAAJUEACAOjAIAALADADCNAgAAgwMAEI4CAACwAwAwjwIBAJ8DACGXAkAAowMAIZgCQACjAwAhpAIBAJ8DACGlAgEAnwMAIaYCAQCfAwAhpwIBAKADACGoAgEAnwMAIakCAACxAwAgqgIgALIDACGrAkAAswMAIQMAAAD2AgAgAQAAggMAMCkAAIMDACADAAAA9gIAIAEAAPcCADACAADzAgAgAQAAACAAIAEAAAAgACADAAAAHgAgAQAAHwAwAgAAIAAgAwAAAB4AIAEAAB8AMAIAACAAIAMAAAAeACABAAAfADACAAAgACANBwAAsAQAIAkAALEEACAPAACzBAAgEAAAsgQAII8CAQAAAAGQAgEAAAABkQIBAAAAAZICAQAAAAGTAgIAAAABlQIAAACVAgKWAgEAAAABlwJAAAAAAZgCQAAAAAEBHQAAiwMAIAmPAgEAAAABkAIBAAAAAZECAQAAAAGSAgEAAAABkwICAAAAAZUCAAAAlQIClgIBAAAAAZcCQAAAAAGYAkAAAAABAR0AAI0DADABHQAAjQMAMAEAAAAeACANBwAAoAQAIAkAAKEEACAPAACiBAAgEAAAowQAII8CAQCbBAAhkAIBAJsEACGRAgEAmwQAIZICAQCfBAAhkwICAJwEACGVAgAAnQSVAiKWAgEAmwQAIZcCQACeBAAhmAJAAJ4EACECAAAAIAAgHQAAkQMAIAmPAgEAmwQAIZACAQCbBAAhkQIBAJsEACGSAgEAnwQAIZMCAgCcBAAhlQIAAJ0ElQIilgIBAJsEACGXAkAAngQAIZgCQACeBAAhAgAAAB4AIB0AAJMDACACAAAAHgAgHQAAkwMAIAEAAAAeACADAAAAIAAgJAAAiwMAICUAAJEDACABAAAAIAAgAQAAAB4AIAYNAACWBAAgKgAAmQQAICsAAJgEACCcAQAAlwQAIJ0BAACaBAAgkgIAAJUEACAMjAIAAJ4DADCNAgAAmwMAEI4CAACeAwAwjwIBAJ8DACGQAgEAnwMAIZECAQCfAwAhkgIBAKADACGTAgIAoQMAIZUCAACiA5UCIpYCAQCfAwAhlwJAAKMDACGYAkAAowMAIQMAAAAeACABAACaAwAwKQAAmwMAIAMAAAAeACABAAAfADACAAAgACAMjAIAAJ4DADCNAgAAmwMAEI4CAACeAwAwjwIBAJ8DACGQAgEAnwMAIZECAQCfAwAhkgIBAKADACGTAgIAoQMAIZUCAACiA5UCIpYCAQCfAwAhlwJAAKMDACGYAkAAowMAIQ4NAAClAwAgKgAArwMAICsAAK8DACCZAgEAAAABmgIBAAAABJsCAQAAAAScAgEAAAABnQIBAAAAAZ4CAQAAAAGfAgEAAAABoAIBAK4DACGhAgEAAAABogIBAAAAAaMCAQAAAAEODQAArAMAICoAAK0DACArAACtAwAgmQIBAAAAAZoCAQAAAAWbAgEAAAAFnAIBAAAAAZ0CAQAAAAGeAgEAAAABnwIBAAAAAaACAQCrAwAhoQIBAAAAAaICAQAAAAGjAgEAAAABDQ0AAKUDACAqAAClAwAgKwAApQMAIJwBAACqAwAgnQEAAKUDACCZAgIAAAABmgICAAAABJsCAgAAAAScAgIAAAABnQICAAAAAZ4CAgAAAAGfAgIAAAABoAICAKkDACEHDQAApQMAICoAAKgDACArAACoAwAgmQIAAACVAgKaAgAAAJUCCJsCAAAAlQIIoAIAAKcDlQIiCw0AAKUDACAqAACmAwAgKwAApgMAIJkCQAAAAAGaAkAAAAAEmwJAAAAABJwCQAAAAAGdAkAAAAABngJAAAAAAZ8CQAAAAAGgAkAApAMAIQsNAAClAwAgKgAApgMAICsAAKYDACCZAkAAAAABmgJAAAAABJsCQAAAAAScAkAAAAABnQJAAAAAAZ4CQAAAAAGfAkAAAAABoAJAAKQDACEImQICAAAAAZoCAgAAAASbAgIAAAAEnAICAAAAAZ0CAgAAAAGeAgIAAAABnwICAAAAAaACAgClAwAhCJkCQAAAAAGaAkAAAAAEmwJAAAAABJwCQAAAAAGdAkAAAAABngJAAAAAAZ8CQAAAAAGgAkAApgMAIQcNAAClAwAgKgAAqAMAICsAAKgDACCZAgAAAJUCApoCAAAAlQIImwIAAACVAgigAgAApwOVAiIEmQIAAACVAgKaAgAAAJUCCJsCAAAAlQIIoAIAAKgDlQIiDQ0AAKUDACAqAAClAwAgKwAApQMAIJwBAACqAwAgnQEAAKUDACCZAgIAAAABmgICAAAABJsCAgAAAAScAgIAAAABnQICAAAAAZ4CAgAAAAGfAgIAAAABoAICAKkDACEImQIIAAAAAZoCCAAAAASbAggAAAAEnAIIAAAAAZ0CCAAAAAGeAggAAAABnwIIAAAAAaACCACqAwAhDg0AAKwDACAqAACtAwAgKwAArQMAIJkCAQAAAAGaAgEAAAAFmwIBAAAABZwCAQAAAAGdAgEAAAABngIBAAAAAZ8CAQAAAAGgAgEAqwMAIaECAQAAAAGiAgEAAAABowIBAAAAAQiZAgIAAAABmgICAAAABZsCAgAAAAWcAgIAAAABnQICAAAAAZ4CAgAAAAGfAgIAAAABoAICAKwDACELmQIBAAAAAZoCAQAAAAWbAgEAAAAFnAIBAAAAAZ0CAQAAAAGeAgEAAAABnwIBAAAAAaACAQCtAwAhoQIBAAAAAaICAQAAAAGjAgEAAAABDg0AAKUDACAqAACvAwAgKwAArwMAIJkCAQAAAAGaAgEAAAAEmwIBAAAABJwCAQAAAAGdAgEAAAABngIBAAAAAZ8CAQAAAAGgAgEArgMAIaECAQAAAAGiAgEAAAABowIBAAAAAQuZAgEAAAABmgIBAAAABJsCAQAAAAScAgEAAAABnQIBAAAAAZ4CAQAAAAGfAgEAAAABoAIBAK8DACGhAgEAAAABogIBAAAAAaMCAQAAAAEOjAIAALADADCNAgAAgwMAEI4CAACwAwAwjwIBAJ8DACGXAkAAowMAIZgCQACjAwAhpAIBAJ8DACGlAgEAnwMAIaYCAQCfAwAhpwIBAKADACGoAgEAnwMAIakCAACxAwAgqgIgALIDACGrAkAAswMAIQ8NAACsAwAgKgAAuAMAICsAALgDACCZAoAAAAABnAKAAAAAAZ0CgAAAAAGeAoAAAAABnwKAAAAAAaACgAAAAAGsAgEAAAABrQIBAAAAAa4CAQAAAAGvAoAAAAABsAKAAAAAAbECgAAAAAEFDQAApQMAICoAALcDACArAAC3AwAgmQIgAAAAAaACIAC2AwAhCw0AAKwDACAqAAC1AwAgKwAAtQMAIJkCQAAAAAGaAkAAAAAFmwJAAAAABZwCQAAAAAGdAkAAAAABngJAAAAAAZ8CQAAAAAGgAkAAtAMAIQsNAACsAwAgKgAAtQMAICsAALUDACCZAkAAAAABmgJAAAAABZsCQAAAAAWcAkAAAAABnQJAAAAAAZ4CQAAAAAGfAkAAAAABoAJAALQDACEImQJAAAAAAZoCQAAAAAWbAkAAAAAFnAJAAAAAAZ0CQAAAAAGeAkAAAAABnwJAAAAAAaACQAC1AwAhBQ0AAKUDACAqAAC3AwAgKwAAtwMAIJkCIAAAAAGgAiAAtgMAIQKZAiAAAAABoAIgALcDACEMmQKAAAAAAZwCgAAAAAGdAoAAAAABngKAAAAAAZ8CgAAAAAGgAoAAAAABrAIBAAAAAa0CAQAAAAGuAgEAAAABrwKAAAAAAbACgAAAAAGxAoAAAAABDowCAAC5AwAwjQIAAPYCABCOAgAAuQMAMI8CAQC6AwAhlwJAAL8DACGYAkAAvwMAIaQCAQC6AwAhpQIBALoDACGmAgEAugMAIacCAQC7AwAhqAIBALoDACGpAgAAvAMAIKoCIAC9AwAhqwJAAL4DACELmQIBAAAAAZoCAQAAAASbAgEAAAAEnAIBAAAAAZ0CAQAAAAGeAgEAAAABnwIBAAAAAaACAQCvAwAhoQIBAAAAAaICAQAAAAGjAgEAAAABC5kCAQAAAAGaAgEAAAAFmwIBAAAABZwCAQAAAAGdAgEAAAABngIBAAAAAZ8CAQAAAAGgAgEArQMAIaECAQAAAAGiAgEAAAABowIBAAAAAQyZAoAAAAABnAKAAAAAAZ0CgAAAAAGeAoAAAAABnwKAAAAAAaACgAAAAAGsAgEAAAABrQIBAAAAAa4CAQAAAAGvAoAAAAABsAKAAAAAAbECgAAAAAECmQIgAAAAAaACIAC3AwAhCJkCQAAAAAGaAkAAAAAFmwJAAAAABZwCQAAAAAGdAkAAAAABngJAAAAAAZ8CQAAAAAGgAkAAtQMAIQiZAkAAAAABmgJAAAAABJsCQAAAAAScAkAAAAABnQJAAAAAAZ4CQAAAAAGfAkAAAAABoAJAAKYDACELjAIAAMADADCNAgAA8AIAEI4CAADAAwAwjwIBAJ8DACGXAkAAowMAIZgCQACjAwAhsgIBAJ8DACGzAgEAnwMAIbQCAQCfAwAhtQIBAKADACG2AgEAoAMAIQ4DAADEAwAgBgAAwgMAIA4AAMMDACCMAgAAwQMAMI0CAAA0ABCOAgAAwQMAMI8CAQC6AwAhlwJAAL8DACGYAkAAvwMAIbICAQC6AwAhswIBALoDACG0AgEAugMAIbUCAQC7AwAhtgIBALsDACEDtwIAAAsAILgCAAALACC5AgAACwAgA7cCAAAQACC4AgAAEAAguQIAABAAIBsEAADvAwAgBQAA8AMAIAgAAPIDACAOAADDAwAgEQAA8wMAIBMAAPYDACAUAADxAwAgFQAA9AMAIBYAAPUDACAXAAD3AwAgjAIAAOwDADCNAgAATgAQjgIAAOwDADCPAgEAugMAIZUCAADuA_ACIpcCQAC_AwAhmAJAAL8DACG2AgEAuwMAIccCAQC7AwAhyQIBALoDACHaAgEAugMAIesCIAC9AwAh7AIBALsDACHuAgAA7QPuAiLwAiAAvQMAIfECAABOACDyAgAATgAgDYwCAADFAwAwjQIAANgCABCOAgAAxQMAMI8CAQCfAwAhkQIBAJ8DACGVAgAAyAO_AiKXAkAAowMAIbICAQCfAwAhugIBAKADACG7AgEAxgMAIbwCAACxAwAgvQIIAMcDACG_AgEAnwMAIQsNAACsAwAgKgAArQMAICsAAK0DACCZAgEAAAABmgIBAAAABZsCAQAAAAWcAgEAAAABnQIBAAAAAZ4CAQAAAAGfAgEAAAABoAIBAMwDACENDQAApQMAICoAAKoDACArAACqAwAgnAEAAKoDACCdAQAAqgMAIJkCCAAAAAGaAggAAAAEmwIIAAAABJwCCAAAAAGdAggAAAABngIIAAAAAZ8CCAAAAAGgAggAywMAIQcNAAClAwAgKgAAygMAICsAAMoDACCZAgAAAL8CApoCAAAAvwIImwIAAAC_AgigAgAAyQO_AiIHDQAApQMAICoAAMoDACArAADKAwAgmQIAAAC_AgKaAgAAAL8CCJsCAAAAvwIIoAIAAMkDvwIiBJkCAAAAvwICmgIAAAC_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_ACIpcCQACjAwAhmAJAAKMDACG2AgEAoAMAIccCAQCgAwAhyQIBAJ8DACHaAgEAnwMAIesCIACyAwAh7AIBAKADACHuAgAA5gPuAiLwAiAAsgMAIQcNAAClAwAgKgAA6wMAICsAAOsDACCZAgAAAO4CApoCAAAA7gIImwIAAADuAgigAgAA6gPuAiIHDQAApQMAICoAAOkDACArAADpAwAgmQIAAADwAgKaAgAAAPACCJsCAAAA8AIIoAIAAOgD8AIiBw0AAKUDACAqAADpAwAgKwAA6QMAIJkCAAAA8AICmgIAAADwAgibAgAAAPACCKACAADoA_ACIgSZAgAAAPACApoCAAAA8AIImwIAAADwAgigAgAA6QPwAiIHDQAApQMAICoAAOsDACArAADrAwAgmQIAAADuAgKaAgAAAO4CCJsCAAAA7gIIoAIAAOoD7gIiBJkCAAAA7gICmgIAAADuAgibAgAAAO4CCKACAADrA-4CIhkEAADvAwAgBQAA8AMAIAgAAPIDACAOAADDAwAgEQAA8wMAIBMAAPYDACAUAADxAwAgFQAA9AMAIBYAAPUDACAXAAD3AwAgjAIAAOwDADCNAgAATgAQjgIAAOwDADCPAgEAugMAIZUCAADuA_ACIpcCQAC_AwAhmAJAAL8DACG2AgEAuwMAIccCAQC7AwAhyQIBALoDACHaAgEAugMAIesCIAC9AwAh7AIBALsDACHuAgAA7QPuAiLwAiAAvQMAIQSZAgAAAO4CApoCAAAA7gIImwIAAADuAgigAgAA6wPuAiIEmQIAAADwAgKaAgAAAPACCJsCAAAA8AIIoAIAAOkD8AIiA7cCAAADACC4AgAAAwAguQIAAAMAIAO3AgAABwAguAIAAAcAILkCAAAHACADtwIAABgAILgCAAAYACC5AgAAGAAgEAMAAMQDACAGAADCAwAgDgAAwwMAIIwCAADBAwAwjQIAADQAEI4CAADBAwAwjwIBALoDACGXAkAAvwMAIZgCQAC_AwAhsgIBALoDACGzAgEAugMAIbQCAQC6AwAhtQIBALsDACG2AgEAuwMAIfECAAA0ACDyAgAANAAgA7cCAAAeACC4AgAAHgAguQIAAB4AIAO3AgAANwAguAIAADcAILkCAAA3ACADtwIAADsAILgCAAA7ACC5AgAAOwAgA7cCAAAoACC4AgAAKAAguQIAACgAIAO3AgAAQAAguAIAAEAAILkCAABAACAJAwAAxAMAIIwCAAD4AwAwjQIAAEAAEI4CAAD4AwAwjwIBALoDACGXAkAAvwMAIZgCQAC_AwAhsgIBALoDACHJAgEAugMAIQsDAADEAwAgjAIAAPkDADCNAgAAOwAQjgIAAPkDADCPAgEAugMAIZcCQAC_AwAhmAJAAL8DACGyAgEAugMAIbUCAQC6AwAhtgIBALsDACHKAgEAugMAIQwDAADEAwAgjAIAAPoDADCNAgAANwAQjgIAAPoDADCPAgEAugMAIZcCQAC_AwAhmAJAAL8DACGyAgEAugMAId8CQAC_AwAh6AIBALoDACHpAgEAuwMAIeoCAQC7AwAhDQkAAPwDACASAADEAwAgjAIAAPsDADCNAgAAKAAQjgIAAPsDADCPAgEAugMAIZcCQAC_AwAhmAJAAL8DACGoAgEAugMAIcoCAQC6AwAhywIAANQDACDbAgEAugMAIdwCAQC6AwAhGwUAAJIEACAIAACLBAAgCwAAjAQAIAwAAPEDACARAADzAwAgEwAA9gMAIIwCAACOBAAwjQIAAAsAEI4CAACOBAAwjwIBALoDACGVAgAAkQTWAiKXAkAAvwMAIZgCQAC_AwAhtQIBALsDACHAAgIAgwQAIcICAQC6AwAhygIBALoDACHLAgAA1AMAIMwCQAC_AwAhzQIBALoDACHOAiAAvQMAIdACAACPBNACItECAQC6AwAh0gICAIMEACHUAgAAkATUAiLxAgAACwAg8gIAAAsAIBADAADEAwAgCQAAgAQAIAoAAIEEACCMAgAA_QMAMI0CAAAYABCOAgAA_QMAMI8CAQC6AwAhkQIBALoDACGVAgAA_wO_AiKXAkAAvwMAIbICAQC6AwAhugIBALsDACG7AgEAhgQAIbwCAAC8AwAgvQIIAP4DACG_AgEAugMAIQiZAggAAAABmgIIAAAABJsCCAAAAAScAggAAAABnQIIAAAAAZ4CCAAAAAGfAggAAAABoAIIAKoDACEEmQIAAAC_AgKaAgAAAL8CCJsCAAAAvwIIoAIAAMoDvwIiGwUAAJIEACAIAACLBAAgCwAAjAQAIAwAAPEDACARAADzAwAgEwAA9gMAIIwCAACOBAAwjQIAAAsAEI4CAACOBAAwjwIBALoDACGVAgAAkQTWAiKXAkAAvwMAIZgCQAC_AwAhtQIBALsDACHAAgIAgwQAIcICAQC6AwAhygIBALoDACHLAgAA1AMAIMwCQAC_AwAhzQIBALoDACHOAiAAvQMAIdACAACPBNACItECAQC6AwAh0gICAIMEACHUAgAAkATUAiLxAgAACwAg8gIAAAsAIBUHAADEAwAgCAAAiwQAIAsAAIwEACAMAACNBAAgjAIAAIkEADCNAgAAEAAQjgIAAIkEADCPAgEAugMAIZACAQC6AwAhlQIAAIoExgIilwJAAL8DACGYAkAAvwMAIbQCAQC6AwAhwgIBALoDACHDAgEAuwMAIcQCAQC7AwAhxgICAIMEACHHAgEAuwMAIcgCAAD_A78CIvECAAAQACDyAgAAEAAgEAcAAMQDACAJAACABAAgDwAAhQQAIBAAAPMDACCMAgAAggQAMI0CAAAeABCOAgAAggQAMI8CAQC6AwAhkAIBALoDACGRAgEAugMAIZICAQC7AwAhkwICAIMEACGVAgAAhASVAiKWAgEAugMAIZcCQAC_AwAhmAJAAL8DACEImQICAAAAAZoCAgAAAASbAgIAAAAEnAICAAAAAZ0CAgAAAAGeAgIAAAABnwICAAAAAaACAgClAwAhBJkCAAAAlQICmgIAAACVAgibAgAAAJUCCKACAACoA5UCIhIHAADEAwAgCQAAgAQAIA8AAIUEACAQAADzAwAgjAIAAIIEADCNAgAAHgAQjgIAAIIEADCPAgEAugMAIZACAQC6AwAhkQIBALoDACGSAgEAuwMAIZMCAgCDBAAhlQIAAIQElQIilgIBALoDACGXAkAAvwMAIZgCQAC_AwAh8QIAAB4AIPICAAAeACAImQIBAAAAAZoCAQAAAAWbAgEAAAAFnAIBAAAAAZ0CAQAAAAGeAgEAAAABnwIBAAAAAaACAQCHBAAhCJkCAQAAAAGaAgEAAAAFmwIBAAAABZwCAQAAAAGdAgEAAAABngIBAAAAAZ8CAQAAAAGgAgEAhwQAIQwJAACABAAgCgAAgQQAIIwCAACIBAAwjQIAABQAEI4CAACIBAAwjwIBALoDACGRAgEAugMAIZcCQAC_AwAhmAJAAL8DACG_AgEAugMAIcACCAD-AwAhwQICAIMEACETBwAAxAMAIAgAAIsEACALAACMBAAgDAAAjQQAIIwCAACJBAAwjQIAABAAEI4CAACJBAAwjwIBALoDACGQAgEAugMAIZUCAACKBMYCIpcCQAC_AwAhmAJAAL8DACG0AgEAugMAIcICAQC6AwAhwwIBALsDACHEAgEAuwMAIcYCAgCDBAAhxwIBALsDACHIAgAA_wO_AiIEmQIAAADGAgKaAgAAAMYCCJsCAAAAxgIIoAIAANEDxgIiEAMAAMQDACAGAADCAwAgDgAAwwMAIIwCAADBAwAwjQIAADQAEI4CAADBAwAwjwIBALoDACGXAkAAvwMAIZgCQAC_AwAhsgIBALoDACGzAgEAugMAIbQCAQC6AwAhtQIBALsDACG2AgEAuwMAIfECAAA0ACDyAgAANAAgA7cCAAAUACC4AgAAFAAguQIAABQAIBIDAADEAwAgCQAAgAQAIAoAAIEEACCMAgAA_QMAMI0CAAAYABCOAgAA_QMAMI8CAQC6AwAhkQIBALoDACGVAgAA_wO_AiKXAkAAvwMAIbICAQC6AwAhugIBALsDACG7AgEAhgQAIbwCAAC8AwAgvQIIAP4DACG_AgEAugMAIfECAAAYACDyAgAAGAAgGQUAAJIEACAIAACLBAAgCwAAjAQAIAwAAPEDACARAADzAwAgEwAA9gMAIIwCAACOBAAwjQIAAAsAEI4CAACOBAAwjwIBALoDACGVAgAAkQTWAiKXAkAAvwMAIZgCQAC_AwAhtQIBALsDACHAAgIAgwQAIcICAQC6AwAhygIBALoDACHLAgAA1AMAIMwCQAC_AwAhzQIBALoDACHOAiAAvQMAIdACAACPBNACItECAQC6AwAh0gICAIMEACHUAgAAkATUAiIEmQIAAADQAgKaAgAAANACCJsCAAAA0AIIoAIAAN0D0AIiBJkCAAAA1AICmgIAAADUAgibAgAAANQCCKACAADbA9QCIgSZAgAAANYCApoCAAAA1gIImwIAAADWAgigAgAA2QPWAiINAwAAxAMAIAYAAMIDACCMAgAAkwQAMI0CAAAHABCOAgAAkwQAMI8CAQC6AwAhlwJAAL8DACGYAkAAvwMAIbYCAQC6AwAh2QIBALoDACHaAgEAugMAIfECAAAHACDyAgAABwAgCwMAAMQDACAGAADCAwAgjAIAAJMEADCNAgAABwAQjgIAAJMEADCPAgEAugMAIZcCQAC_AwAhmAJAAL8DACG2AgEAugMAIdkCAQC6AwAh2gIBALoDACERAwAAxAMAIIwCAACUBAAwjQIAAAMAEI4CAACUBAAwjwIBALoDACGXAkAAvwMAIZgCQAC_AwAhsgIBALoDACHCAgEAugMAIeACAQC6AwAh4QIBALsDACHiAgEAuwMAIeMCAQC7AwAh5AJAAL4DACHlAkAAvgMAIeYCAQC7AwAh5wIBALsDACEAAAAAAAAB9gIBAAAAAQX2AgIAAAAB_QICAAAAAf4CAgAAAAH_AgIAAAABgAMCAAAAAQH2AgAAAJUCAgH2AkAAAAABAfYCAQAAAAEFJAAA-QcAICUAAIMIACDzAgAA-gcAIPQCAACCCAAg-QIAAAEAIAUkAAD3BwAgJQAAgAgAIPMCAAD4BwAg9AIAAP8HACD5AgAADQAgByQAAPUHACAlAAD9BwAg8wIAAPYHACD0AgAA_AcAIPcCAAAeACD4AgAAHgAg-QIAACAAIAskAACkBAAwJQAAqQQAMPMCAAClBAAw9AIAAKYEADD1AgAApwQAIPYCAACoBAAw9wIAAKgEADD4AgAAqAQAMPkCAACoBAAw-gIAAKoEADD7AgAAqwQAMAsHAACwBAAgCQAAsQQAIBAAALIEACCPAgEAAAABkAIBAAAAAZECAQAAAAGTAgIAAAABlQIAAACVAgKWAgEAAAABlwJAAAAAAZgCQAAAAAECAAAAIAAgJAAArwQAIAMAAAAgACAkAACvBAAgJQAArgQAIAEdAAD7BwAwEAcAAMQDACAJAACABAAgDwAAhQQAIBAAAPMDACCMAgAAggQAMI0CAAAeABCOAgAAggQAMI8CAQAAAAGQAgEAugMAIZECAQC6AwAhkgIBALsDACGTAgIAgwQAIZUCAACEBJUCIpYCAQC6AwAhlwJAAL8DACGYAkAAvwMAIQIAAAAgACAdAACuBAAgAgAAAKwEACAdAACtBAAgDIwCAACrBAAwjQIAAKwEABCOAgAAqwQAMI8CAQC6AwAhkAIBALoDACGRAgEAugMAIZICAQC7AwAhkwICAIMEACGVAgAAhASVAiKWAgEAugMAIZcCQAC_AwAhmAJAAL8DACEMjAIAAKsEADCNAgAArAQAEI4CAACrBAAwjwIBALoDACGQAgEAugMAIZECAQC6AwAhkgIBALsDACGTAgIAgwQAIZUCAACEBJUCIpYCAQC6AwAhlwJAAL8DACGYAkAAvwMAIQiPAgEAmwQAIZACAQCbBAAhkQIBAJsEACGTAgIAnAQAIZUCAACdBJUCIpYCAQCbBAAhlwJAAJ4EACGYAkAAngQAIQsHAACgBAAgCQAAoQQAIBAAAKMEACCPAgEAmwQAIZACAQCbBAAhkQIBAJsEACGTAgIAnAQAIZUCAACdBJUCIpYCAQCbBAAhlwJAAJ4EACGYAkAAngQAIQsHAACwBAAgCQAAsQQAIBAAALIEACCPAgEAAAABkAIBAAAAAZECAQAAAAGTAgIAAAABlQIAAACVAgKWAgEAAAABlwJAAAAAAZgCQAAAAAEDJAAA-QcAIPMCAAD6BwAg-QIAAAEAIAMkAAD3BwAg8wIAAPgHACD5AgAADQAgBCQAAKQEADDzAgAApQQAMPUCAACnBAAg-QIAAKgEADADJAAA9QcAIPMCAAD2BwAg-QIAACAAIAAAAAH2AiAAAAABAfYCQAAAAAEAAAALJAAA6wQAMCUAAPAEADDzAgAA7AQAMPQCAADtBAAw9QIAAO4EACD2AgAA7wQAMPcCAADvBAAw-AIAAO8EADD5AgAA7wQAMPoCAADxBAAw-wIAAPIEADALJAAAvwQAMCUAAMQEADDzAgAAwAQAMPQCAADBBAAw9QIAAMIEACD2AgAAwwQAMPcCAADDBAAw-AIAAMMEADD5AgAAwwQAMPoCAADFBAAw-wIAAMYEADAFJAAAwQcAICUAAPMHACDzAgAAwgcAIPQCAADyBwAg-QIAAAEAIA4HAADoBAAgCwAA6QQAIAwAAOoEACCPAgEAAAABkAIBAAAAAZUCAAAAxgIClwJAAAAAAZgCQAAAAAG0AgEAAAABwwIBAAAAAcQCAQAAAAHGAgIAAAABxwIBAAAAAcgCAAAAvwICAgAAABIAICQAAOcEACADAAAAEgAgJAAA5wQAICUAAMsEACABHQAA8QcAMBMHAADEAwAgCAAAiwQAIAsAAIwEACAMAACNBAAgjAIAAIkEADCNAgAAEAAQjgIAAIkEADCPAgEAAAABkAIBALoDACGVAgAAigTGAiKXAkAAvwMAIZgCQAC_AwAhtAIBALoDACHCAgEAugMAIcMCAQC7AwAhxAIBALsDACHGAgIAgwQAIccCAQC7AwAhyAIAAP8DvwIiAgAAABIAIB0AAMsEACACAAAAxwQAIB0AAMgEACAPjAIAAMYEADCNAgAAxwQAEI4CAADGBAAwjwIBALoDACGQAgEAugMAIZUCAACKBMYCIpcCQAC_AwAhmAJAAL8DACG0AgEAugMAIcICAQC6AwAhwwIBALsDACHEAgEAuwMAIcYCAgCDBAAhxwIBALsDACHIAgAA_wO_AiIPjAIAAMYEADCNAgAAxwQAEI4CAADGBAAwjwIBALoDACGQAgEAugMAIZUCAACKBMYCIpcCQAC_AwAhmAJAAL8DACG0AgEAugMAIcICAQC6AwAhwwIBALsDACHEAgEAuwMAIcYCAgCDBAAhxwIBALsDACHIAgAA_wO_AiILjwIBAJsEACGQAgEAmwQAIZUCAADJBMYCIpcCQACeBAAhmAJAAJ4EACG0AgEAmwQAIcMCAQCfBAAhxAIBAJ8EACHGAgIAnAQAIccCAQCfBAAhyAIAAMoEvwIiAfYCAAAAxgICAfYCAAAAvwICDgcAAMwEACALAADNBAAgDAAAzgQAII8CAQCbBAAhkAIBAJsEACGVAgAAyQTGAiKXAkAAngQAIZgCQACeBAAhtAIBAJsEACHDAgEAnwQAIcQCAQCfBAAhxgICAJwEACHHAgEAnwQAIcgCAADKBL8CIgUkAADcBwAgJQAA7wcAIPMCAADdBwAg9AIAAO4HACD5AgAAAQAgCyQAANkEADAlAADeBAAw8wIAANoEADD0AgAA2wQAMPUCAADcBAAg9gIAAN0EADD3AgAA3QQAMPgCAADdBAAw-QIAAN0EADD6AgAA3wQAMPsCAADgBAAwByQAAM8EACAlAADSBAAg8wIAANAEACD0AgAA0QQAIPcCAAAYACD4AgAAGAAg-QIAACYAIAsDAADXBAAgCQAA2AQAII8CAQAAAAGRAgEAAAABlQIAAAC_AgKXAkAAAAABsgIBAAAAAboCAQAAAAG7AgEAAAABvAKAAAAAAb0CCAAAAAECAAAAJgAgJAAAzwQAIAMAAAAYACAkAADPBAAgJQAA0wQAIA0AAAAYACADAADVBAAgCQAA1gQAIB0AANMEACCPAgEAmwQAIZECAQCbBAAhlQIAAMoEvwIilwJAAJ4EACGyAgEAmwQAIboCAQCfBAAhuwIBAJ8EACG8AoAAAAABvQIIANQEACELAwAA1QQAIAkAANYEACCPAgEAmwQAIZECAQCbBAAhlQIAAMoEvwIilwJAAJ4EACGyAgEAmwQAIboCAQCfBAAhuwIBAJ8EACG8AoAAAAABvQIIANQEACEF9gIIAAAAAf0CCAAAAAH-AggAAAAB_wIIAAAAAYADCAAAAAEFJAAA5gcAICUAAOwHACDzAgAA5wcAIPQCAADrBwAg-QIAAAEAIAUkAADkBwAgJQAA6QcAIPMCAADlBwAg9AIAAOgHACD5AgAADQAgAyQAAOYHACDzAgAA5wcAIPkCAAABACADJAAA5AcAIPMCAADlBwAg-QIAAA0AIAcJAADmBAAgjwIBAAAAAZECAQAAAAGXAkAAAAABmAJAAAAAAcACCAAAAAHBAgIAAAABAgAAABYAICQAAOUEACADAAAAFgAgJAAA5QQAICUAAOMEACABHQAA4wcAMAwJAACABAAgCgAAgQQAIIwCAACIBAAwjQIAABQAEI4CAACIBAAwjwIBAAAAAZECAQC6AwAhlwJAAL8DACGYAkAAvwMAIb8CAQC6AwAhwAIIAP4DACHBAgIAgwQAIQIAAAAWACAdAADjBAAgAgAAAOEEACAdAADiBAAgCowCAADgBAAwjQIAAOEEABCOAgAA4AQAMI8CAQC6AwAhkQIBALoDACGXAkAAvwMAIZgCQAC_AwAhvwIBALoDACHAAggA_gMAIcECAgCDBAAhCowCAADgBAAwjQIAAOEEABCOAgAA4AQAMI8CAQC6AwAhkQIBALoDACGXAkAAvwMAIZgCQAC_AwAhvwIBALoDACHAAggA_gMAIcECAgCDBAAhBo8CAQCbBAAhkQIBAJsEACGXAkAAngQAIZgCQACeBAAhwAIIANQEACHBAgIAnAQAIQcJAADkBAAgjwIBAJsEACGRAgEAmwQAIZcCQACeBAAhmAJAAJ4EACHAAggA1AQAIcECAgCcBAAhBSQAAN4HACAlAADhBwAg8wIAAN8HACD0AgAA4AcAIPkCAAANACAHCQAA5gQAII8CAQAAAAGRAgEAAAABlwJAAAAAAZgCQAAAAAHAAggAAAABwQICAAAAAQMkAADeBwAg8wIAAN8HACD5AgAADQAgDgcAAOgEACALAADpBAAgDAAA6gQAII8CAQAAAAGQAgEAAAABlQIAAADGAgKXAkAAAAABmAJAAAAAAbQCAQAAAAHDAgEAAAABxAIBAAAAAcYCAgAAAAHHAgEAAAAByAIAAAC_AgIDJAAA3AcAIPMCAADdBwAg-QIAAAEAIAQkAADZBAAw8wIAANoEADD1AgAA3AQAIPkCAADdBAAwAyQAAM8EACDzAgAA0AQAIPkCAAAmACAUBQAAswUAIAsAALQFACAMAAC2BQAgEQAAtQUAIBMAALcFACCPAgEAAAABlQIAAADWAgKXAkAAAAABmAJAAAAAAbUCAQAAAAHAAgIAAAABygIBAAAAAcsCAACyBQAgzAJAAAAAAc0CAQAAAAHOAiAAAAAB0AIAAADQAgLRAgEAAAAB0gICAAAAAdQCAAAA1AICAgAAAA0AICQAALEFACADAAAADQAgJAAAsQUAICUAAPkEACABHQAA2wcAMBkFAACSBAAgCAAAiwQAIAsAAIwEACAMAADxAwAgEQAA8wMAIBMAAPYDACCMAgAAjgQAMI0CAAALABCOAgAAjgQAMI8CAQAAAAGVAgAAkQTWAiKXAkAAvwMAIZgCQAC_AwAhtQIBALsDACHAAgIAgwQAIcICAQC6AwAhygIBALoDACHLAgAA1AMAIMwCQAC_AwAhzQIBALoDACHOAiAAvQMAIdACAACPBNACItECAQC6AwAh0gICAIMEACHUAgAAkATUAiICAAAADQAgHQAA-QQAIAIAAADzBAAgHQAA9AQAIBOMAgAA8gQAMI0CAADzBAAQjgIAAPIEADCPAgEAugMAIZUCAACRBNYCIpcCQAC_AwAhmAJAAL8DACG1AgEAuwMAIcACAgCDBAAhwgIBALoDACHKAgEAugMAIcsCAADUAwAgzAJAAL8DACHNAgEAugMAIc4CIAC9AwAh0AIAAI8E0AIi0QIBALoDACHSAgIAgwQAIdQCAACQBNQCIhOMAgAA8gQAMI0CAADzBAAQjgIAAPIEADCPAgEAugMAIZUCAACRBNYCIpcCQAC_AwAhmAJAAL8DACG1AgEAuwMAIcACAgCDBAAhwgIBALoDACHKAgEAugMAIcsCAADUAwAgzAJAAL8DACHNAgEAugMAIc4CIAC9AwAh0AIAAI8E0AIi0QIBALoDACHSAgIAgwQAIdQCAACQBNQCIg-PAgEAmwQAIZUCAAD4BNYCIpcCQACeBAAhmAJAAJ4EACG1AgEAnwQAIcACAgCcBAAhygIBAJsEACHLAgAA9QQAIMwCQACeBAAhzQIBAJsEACHOAiAAtwQAIdACAAD2BNACItECAQCbBAAh0gICAJwEACHUAgAA9wTUAiIC9gIBAAAABPwCAQAAAAUB9gIAAADQAgIB9gIAAADUAgIB9gIAAADWAgIUBQAA-gQAIAsAAPsEACAMAAD9BAAgEQAA_AQAIBMAAP4EACCPAgEAmwQAIZUCAAD4BNYCIpcCQACeBAAhmAJAAJ4EACG1AgEAnwQAIcACAgCcBAAhygIBAJsEACHLAgAA9QQAIMwCQACeBAAhzQIBAJsEACHOAiAAtwQAIdACAAD2BNACItECAQCbBAAh0gICAJwEACHUAgAA9wTUAiIFJAAAwwcAICUAANkHACDzAgAAxAcAIPQCAADYBwAg-QIAAAkAIAskAACmBQAwJQAAqgUAMPMCAACnBQAw9AIAAKgFADD1AgAAqQUAIPYCAADdBAAw9wIAAN0EADD4AgAA3QQAMPkCAADdBAAw-gIAAKsFADD7AgAA4AQAMAskAACdBQAwJQAAoQUAMPMCAACeBQAw9AIAAJ8FADD1AgAAoAUAIPYCAACoBAAw9wIAAKgEADD4AgAAqAQAMPkCAACoBAAw-gIAAKIFADD7AgAAqwQAMAskAACPBQAwJQAAlAUAMPMCAACQBQAw9AIAAJEFADD1AgAAkgUAIPYCAACTBQAw9wIAAJMFADD4AgAAkwUAMPkCAACTBQAw-gIAAJUFADD7AgAAlgUAMAskAAD_BAAwJQAAhAUAMPMCAACABQAw9AIAAIEFADD1AgAAggUAIPYCAACDBQAw9wIAAIMFADD4AgAAgwUAMPkCAACDBQAw-gIAAIUFADD7AgAAhgUAMAgSAACOBQAgjwIBAAAAAZcCQAAAAAGYAkAAAAABqAIBAAAAAcoCAQAAAAHLAgAAjQUAINsCAQAAAAECAAAAKgAgJAAAjAUAIAMAAAAqACAkAACMBQAgJQAAigUAIAEdAADXBwAwDQkAAPwDACASAADEAwAgjAIAAPsDADCNAgAAKAAQjgIAAPsDADCPAgEAAAABlwJAAL8DACGYAkAAvwMAIagCAQC6AwAhygIBALoDACHLAgAA1AMAINsCAQC6AwAh3AIBALoDACECAAAAKgAgHQAAigUAIAIAAACHBQAgHQAAiAUAIAuMAgAAhgUAMI0CAACHBQAQjgIAAIYFADCPAgEAugMAIZcCQAC_AwAhmAJAAL8DACGoAgEAugMAIcoCAQC6AwAhywIAANQDACDbAgEAugMAIdwCAQC6AwAhC4wCAACGBQAwjQIAAIcFABCOAgAAhgUAMI8CAQC6AwAhlwJAAL8DACGYAkAAvwMAIagCAQC6AwAhygIBALoDACHLAgAA1AMAINsCAQC6AwAh3AIBALoDACEHjwIBAJsEACGXAkAAngQAIZgCQACeBAAhqAIBAJsEACHKAgEAmwQAIcsCAACJBQAg2wIBAJsEACEC9gIBAAAABPwCAQAAAAUIEgAAiwUAII8CAQCbBAAhlwJAAJ4EACGYAkAAngQAIagCAQCbBAAhygIBAJsEACHLAgAAiQUAINsCAQCbBAAhBSQAANIHACAlAADVBwAg8wIAANMHACD0AgAA1AcAIPkCAAABACAIEgAAjgUAII8CAQAAAAGXAkAAAAABmAJAAAAAAagCAQAAAAHKAgEAAAABywIAAI0FACDbAgEAAAABAfYCAQAAAAQDJAAA0gcAIPMCAADTBwAg-QIAAAEAIAsDAADXBAAgCgAAnAUAII8CAQAAAAGVAgAAAL8CApcCQAAAAAGyAgEAAAABugIBAAAAAbsCAQAAAAG8AoAAAAABvQIIAAAAAb8CAQAAAAECAAAAJgAgJAAAmwUAIAMAAAAmACAkAACbBQAgJQAAmQUAIAEdAADRBwAwEAMAAMQDACAJAACABAAgCgAAgQQAIIwCAAD9AwAwjQIAABgAEI4CAAD9AwAwjwIBAAAAAZECAQC6AwAhlQIAAP8DvwIilwJAAL8DACGyAgEAugMAIboCAQAAAAG7AgEAAAABvAIAALwDACC9AggA_gMAIb8CAQAAAAECAAAAJgAgHQAAmQUAIAIAAACXBQAgHQAAmAUAIA2MAgAAlgUAMI0CAACXBQAQjgIAAJYFADCPAgEAugMAIZECAQC6AwAhlQIAAP8DvwIilwJAAL8DACGyAgEAugMAIboCAQC7AwAhuwIBAIYEACG8AgAAvAMAIL0CCAD-AwAhvwIBALoDACENjAIAAJYFADCNAgAAlwUAEI4CAACWBQAwjwIBALoDACGRAgEAugMAIZUCAAD_A78CIpcCQAC_AwAhsgIBALoDACG6AgEAuwMAIbsCAQCGBAAhvAIAALwDACC9AggA_gMAIb8CAQC6AwAhCY8CAQCbBAAhlQIAAMoEvwIilwJAAJ4EACGyAgEAmwQAIboCAQCfBAAhuwIBAJ8EACG8AoAAAAABvQIIANQEACG_AgEAmwQAIQsDAADVBAAgCgAAmgUAII8CAQCbBAAhlQIAAMoEvwIilwJAAJ4EACGyAgEAmwQAIboCAQCfBAAhuwIBAJ8EACG8AoAAAAABvQIIANQEACG_AgEAmwQAIQUkAADMBwAgJQAAzwcAIPMCAADNBwAg9AIAAM4HACD5AgAAEgAgCwMAANcEACAKAACcBQAgjwIBAAAAAZUCAAAAvwIClwJAAAAAAbICAQAAAAG6AgEAAAABuwIBAAAAAbwCgAAAAAG9AggAAAABvwIBAAAAAQMkAADMBwAg8wIAAM0HACD5AgAAEgAgCwcAALAEACAPAACzBAAgEAAAsgQAII8CAQAAAAGQAgEAAAABkgIBAAAAAZMCAgAAAAGVAgAAAJUCApYCAQAAAAGXAkAAAAABmAJAAAAAAQIAAAAgACAkAAClBQAgAwAAACAAICQAAKUFACAlAACkBQAgAR0AAMsHADACAAAAIAAgHQAApAUAIAIAAACsBAAgHQAAowUAIAiPAgEAmwQAIZACAQCbBAAhkgIBAJ8EACGTAgIAnAQAIZUCAACdBJUCIpYCAQCbBAAhlwJAAJ4EACGYAkAAngQAIQsHAACgBAAgDwAAogQAIBAAAKMEACCPAgEAmwQAIZACAQCbBAAhkgIBAJ8EACGTAgIAnAQAIZUCAACdBJUCIpYCAQCbBAAhlwJAAJ4EACGYAkAAngQAIQsHAACwBAAgDwAAswQAIBAAALIEACCPAgEAAAABkAIBAAAAAZICAQAAAAGTAgIAAAABlQIAAACVAgKWAgEAAAABlwJAAAAAAZgCQAAAAAEHCgAAsAUAII8CAQAAAAGXAkAAAAABmAJAAAAAAb8CAQAAAAHAAggAAAABwQICAAAAAQIAAAAWACAkAACvBQAgAwAAABYAICQAAK8FACAlAACtBQAgAR0AAMoHADACAAAAFgAgHQAArQUAIAIAAADhBAAgHQAArAUAIAaPAgEAmwQAIZcCQACeBAAhmAJAAJ4EACG_AgEAmwQAIcACCADUBAAhwQICAJwEACEHCgAArgUAII8CAQCbBAAhlwJAAJ4EACGYAkAAngQAIb8CAQCbBAAhwAIIANQEACHBAgIAnAQAIQUkAADFBwAgJQAAyAcAIPMCAADGBwAg9AIAAMcHACD5AgAAEgAgBwoAALAFACCPAgEAAAABlwJAAAAAAZgCQAAAAAG_AgEAAAABwAIIAAAAAcECAgAAAAEDJAAAxQcAIPMCAADGBwAg-QIAABIAIBQFAACzBQAgCwAAtAUAIAwAALYFACARAAC1BQAgEwAAtwUAII8CAQAAAAGVAgAAANYCApcCQAAAAAGYAkAAAAABtQIBAAAAAcACAgAAAAHKAgEAAAABywIAALIFACDMAkAAAAABzQIBAAAAAc4CIAAAAAHQAgAAANACAtECAQAAAAHSAgIAAAAB1AIAAADUAgIB9gIBAAAABAMkAADDBwAg8wIAAMQHACD5AgAACQAgBCQAAKYFADDzAgAApwUAMPUCAACpBQAg-QIAAN0EADAEJAAAnQUAMPMCAACeBQAw9QIAAKAFACD5AgAAqAQAMAQkAACPBQAw8wIAAJAFADD1AgAAkgUAIPkCAACTBQAwBCQAAP8EADDzAgAAgAUAMPUCAACCBQAg-QIAAIMFADAEJAAA6wQAMPMCAADsBAAw9QIAAO4EACD5AgAA7wQAMAQkAAC_BAAw8wIAAMAEADD1AgAAwgQAIPkCAADDBAAwAyQAAMEHACDzAgAAwgcAIPkCAAABACAAAA0EAACABwAgBQAAgQcAIAgAAIMHACAOAAC8BQAgEQAAhAcAIBMAAIcHACAUAACCBwAgFQAAhQcAIBYAAIYHACAXAACIBwAgtgIAAJUEACDHAgAAlQQAIOwCAACVBAAgAAAAAAAAAAAAAAAAAAAABSQAALwHACAlAAC_BwAg8wIAAL0HACD0AgAAvgcAIPkCAADbAgAgAyQAALwHACDzAgAAvQcAIPkCAADbAgAgAAAABSQAALcHACAlAAC6BwAg8wIAALgHACD0AgAAuQcAIPkCAAABACADJAAAtwcAIPMCAAC4BwAg-QIAAAEAIAAAAAAABSQAALIHACAlAAC1BwAg8wIAALMHACD0AgAAtAcAIPkCAADbAgAgAyQAALIHACDzAgAAswcAIPkCAADbAgAgAAAABSQAAK0HACAlAACwBwAg8wIAAK4HACD0AgAArwcAIPkCAAABACADJAAArQcAIPMCAACuBwAg-QIAAAEAIAAAAAUkAACnBwAgJQAAqwcAIPMCAACoBwAg9AIAAKoHACD5AgAAAQAgCyQAAOUFADAlAADpBQAw8wIAAOYFADD0AgAA5wUAMPUCAADoBQAg9gIAAO8EADD3AgAA7wQAMPgCAADvBAAw-QIAAO8EADD6AgAA6gUAMPsCAADyBAAwFAgAANoFACALAAC0BQAgDAAAtgUAIBEAALUFACATAAC3BQAgjwIBAAAAAZUCAAAA1gIClwJAAAAAAZgCQAAAAAG1AgEAAAABwAICAAAAAcICAQAAAAHKAgEAAAABywIAALIFACDMAkAAAAABzQIBAAAAAc4CIAAAAAHQAgAAANACAtICAgAAAAHUAgAAANQCAgIAAAANACAkAADtBQAgAwAAAA0AICQAAO0FACAlAADsBQAgAR0AAKkHADACAAAADQAgHQAA7AUAIAIAAADzBAAgHQAA6wUAIA-PAgEAmwQAIZUCAAD4BNYCIpcCQACeBAAhmAJAAJ4EACG1AgEAnwQAIcACAgCcBAAhwgIBAJsEACHKAgEAmwQAIcsCAAD1BAAgzAJAAJ4EACHNAgEAmwQAIc4CIAC3BAAh0AIAAPYE0AIi0gICAJwEACHUAgAA9wTUAiIUCAAA2QUAIAsAAPsEACAMAAD9BAAgEQAA_AQAIBMAAP4EACCPAgEAmwQAIZUCAAD4BNYCIpcCQACeBAAhmAJAAJ4EACG1AgEAnwQAIcACAgCcBAAhwgIBAJsEACHKAgEAmwQAIcsCAAD1BAAgzAJAAJ4EACHNAgEAmwQAIc4CIAC3BAAh0AIAAPYE0AIi0gICAJwEACHUAgAA9wTUAiIUCAAA2gUAIAsAALQFACAMAAC2BQAgEQAAtQUAIBMAALcFACCPAgEAAAABlQIAAADWAgKXAkAAAAABmAJAAAAAAbUCAQAAAAHAAgIAAAABwgIBAAAAAcoCAQAAAAHLAgAAsgUAIMwCQAAAAAHNAgEAAAABzgIgAAAAAdACAAAA0AIC0gICAAAAAdQCAAAA1AICAyQAAKcHACDzAgAAqAcAIPkCAAABACAEJAAA5QUAMPMCAADmBQAw9QIAAOgFACD5AgAA7wQAMAAAAAckAACiBwAgJQAApQcAIPMCAACjBwAg9AIAAKQHACD3AgAACwAg-AIAAAsAIPkCAAANACADJAAAogcAIPMCAACjBwAg-QIAAA0AIAAAAAAAAAUkAACdBwAgJQAAoAcAIPMCAACeBwAg9AIAAJ8HACD5AgAAAQAgAyQAAJ0HACDzAgAAngcAIPkCAAABACAAAAAFJAAAmAcAICUAAJsHACDzAgAAmQcAIPQCAACaBwAg-QIAAAEAIAMkAACYBwAg8wIAAJkHACD5AgAAAQAgAAAAAfYCAAAA7gICAfYCAAAA8AICCyQAAOoGADAlAADvBgAw8wIAAOsGADD0AgAA7AYAMPUCAADtBgAg9gIAAO4GADD3AgAA7gYAMPgCAADuBgAw-QIAAO4GADD6AgAA8AYAMPsCAADxBgAwCyQAAN4GADAlAADjBgAw8wIAAN8GADD0AgAA4AYAMPUCAADhBgAg9gIAAOIGADD3AgAA4gYAMPgCAADiBgAw-QIAAOIGADD6AgAA5AYAMPsCAADlBgAwCyQAANUGADAlAADZBgAw8wIAANYGADD0AgAA1wYAMPUCAADYBgAg9gIAAJMFADD3AgAAkwUAMPgCAACTBQAw-QIAAJMFADD6AgAA2gYAMPsCAACWBQAwCyQAAMwGADAlAADQBgAw8wIAAM0GADD0AgAAzgYAMPUCAADPBgAg9gIAAMMEADD3AgAAwwQAMPgCAADDBAAw-QIAAMMEADD6AgAA0QYAMPsCAADGBAAwByQAAMcGACAlAADKBgAg8wIAAMgGACD0AgAAyQYAIPcCAAA0ACD4AgAANAAg-QIAANsCACALJAAAvgYAMCUAAMIGADDzAgAAvwYAMPQCAADABgAw9QIAAMEGACD2AgAAqAQAMPcCAACoBAAw-AIAAKgEADD5AgAAqAQAMPoCAADDBgAw-wIAAKsEADALJAAAsgYAMCUAALcGADDzAgAAswYAMPQCAAC0BgAw9QIAALUGACD2AgAAtgYAMPcCAAC2BgAw-AIAALYGADD5AgAAtgYAMPoCAAC4BgAw-wIAALkGADALJAAApgYAMCUAAKsGADDzAgAApwYAMPQCAACoBgAw9QIAAKkGACD2AgAAqgYAMPcCAACqBgAw-AIAAKoGADD5AgAAqgYAMPoCAACsBgAw-wIAAK0GADALJAAAnQYAMCUAAKEGADDzAgAAngYAMPQCAACfBgAw9QIAAKAGACD2AgAAgwUAMPcCAACDBQAw-AIAAIMFADD5AgAAgwUAMPoCAACiBgAw-wIAAIYFADALJAAAkQYAMCUAAJYGADDzAgAAkgYAMPQCAACTBgAw9QIAAJQGACD2AgAAlQYAMPcCAACVBgAw-AIAAJUGADD5AgAAlQYAMPoCAACXBgAw-wIAAJgGADAEjwIBAAAAAZcCQAAAAAGYAkAAAAAByQIBAAAAAQIAAABCACAkAACcBgAgAwAAAEIAICQAAJwGACAlAACbBgAgAR0AAJcHADAJAwAAxAMAIIwCAAD4AwAwjQIAAEAAEI4CAAD4AwAwjwIBAAAAAZcCQAC_AwAhmAJAAL8DACGyAgEAugMAIckCAQAAAAECAAAAQgAgHQAAmwYAIAIAAACZBgAgHQAAmgYAIAiMAgAAmAYAMI0CAACZBgAQjgIAAJgGADCPAgEAugMAIZcCQAC_AwAhmAJAAL8DACGyAgEAugMAIckCAQC6AwAhCIwCAACYBgAwjQIAAJkGABCOAgAAmAYAMI8CAQC6AwAhlwJAAL8DACGYAkAAvwMAIbICAQC6AwAhyQIBALoDACEEjwIBAJsEACGXAkAAngQAIZgCQACeBAAhyQIBAJsEACEEjwIBAJsEACGXAkAAngQAIZgCQACeBAAhyQIBAJsEACEEjwIBAAAAAZcCQAAAAAGYAkAAAAAByQIBAAAAAQgJAAD0BQAgjwIBAAAAAZcCQAAAAAGYAkAAAAABqAIBAAAAAcoCAQAAAAHLAgAAjQUAINwCAQAAAAECAAAAKgAgJAAApQYAIAMAAAAqACAkAAClBgAgJQAApAYAIAEdAACWBwAwAgAAACoAIB0AAKQGACACAAAAhwUAIB0AAKMGACAHjwIBAJsEACGXAkAAngQAIZgCQACeBAAhqAIBAJsEACHKAgEAmwQAIcsCAACJBQAg3AIBAJsEACEICQAA8wUAII8CAQCbBAAhlwJAAJ4EACGYAkAAngQAIagCAQCbBAAhygIBAJsEACHLAgAAiQUAINwCAQCbBAAhCAkAAPQFACCPAgEAAAABlwJAAAAAAZgCQAAAAAGoAgEAAAABygIBAAAAAcsCAACNBQAg3AIBAAAAAQaPAgEAAAABlwJAAAAAAZgCQAAAAAG1AgEAAAABtgIBAAAAAcoCAQAAAAECAAAAPQAgJAAAsQYAIAMAAAA9ACAkAACxBgAgJQAAsAYAIAEdAACVBwAwCwMAAMQDACCMAgAA-QMAMI0CAAA7ABCOAgAA-QMAMI8CAQAAAAGXAkAAvwMAIZgCQAC_AwAhsgIBALoDACG1AgEAugMAIbYCAQC7AwAhygIBALoDACECAAAAPQAgHQAAsAYAIAIAAACuBgAgHQAArwYAIAqMAgAArQYAMI0CAACuBgAQjgIAAK0GADCPAgEAugMAIZcCQAC_AwAhmAJAAL8DACGyAgEAugMAIbUCAQC6AwAhtgIBALsDACHKAgEAugMAIQqMAgAArQYAMI0CAACuBgAQjgIAAK0GADCPAgEAugMAIZcCQAC_AwAhmAJAAL8DACGyAgEAugMAIbUCAQC6AwAhtgIBALsDACHKAgEAugMAIQaPAgEAmwQAIZcCQACeBAAhmAJAAJ4EACG1AgEAmwQAIbYCAQCfBAAhygIBAJsEACEGjwIBAJsEACGXAkAAngQAIZgCQACeBAAhtQIBAJsEACG2AgEAnwQAIcoCAQCbBAAhBo8CAQAAAAGXAkAAAAABmAJAAAAAAbUCAQAAAAG2AgEAAAABygIBAAAAAQePAgEAAAABlwJAAAAAAZgCQAAAAAHfAkAAAAAB6AIBAAAAAekCAQAAAAHqAgEAAAABAgAAADkAICQAAL0GACADAAAAOQAgJAAAvQYAICUAALwGACABHQAAlAcAMAwDAADEAwAgjAIAAPoDADCNAgAANwAQjgIAAPoDADCPAgEAAAABlwJAAL8DACGYAkAAvwMAIbICAQC6AwAh3wJAAL8DACHoAgEAAAAB6QIBALsDACHqAgEAuwMAIQIAAAA5ACAdAAC8BgAgAgAAALoGACAdAAC7BgAgC4wCAAC5BgAwjQIAALoGABCOAgAAuQYAMI8CAQC6AwAhlwJAAL8DACGYAkAAvwMAIbICAQC6AwAh3wJAAL8DACHoAgEAugMAIekCAQC7AwAh6gIBALsDACELjAIAALkGADCNAgAAugYAEI4CAAC5BgAwjwIBALoDACGXAkAAvwMAIZgCQAC_AwAhsgIBALoDACHfAkAAvwMAIegCAQC6AwAh6QIBALsDACHqAgEAuwMAIQePAgEAmwQAIZcCQACeBAAhmAJAAJ4EACHfAkAAngQAIegCAQCbBAAh6QIBAJ8EACHqAgEAnwQAIQePAgEAmwQAIZcCQACeBAAhmAJAAJ4EACHfAkAAngQAIegCAQCbBAAh6QIBAJ8EACHqAgEAnwQAIQePAgEAAAABlwJAAAAAAZgCQAAAAAHfAkAAAAAB6AIBAAAAAekCAQAAAAHqAgEAAAABCwkAALEEACAPAACzBAAgEAAAsgQAII8CAQAAAAGRAgEAAAABkgIBAAAAAZMCAgAAAAGVAgAAAJUCApYCAQAAAAGXAkAAAAABmAJAAAAAAQIAAAAgACAkAADGBgAgAwAAACAAICQAAMYGACAlAADFBgAgAR0AAJMHADACAAAAIAAgHQAAxQYAIAIAAACsBAAgHQAAxAYAIAiPAgEAmwQAIZECAQCbBAAhkgIBAJ8EACGTAgIAnAQAIZUCAACdBJUCIpYCAQCbBAAhlwJAAJ4EACGYAkAAngQAIQsJAAChBAAgDwAAogQAIBAAAKMEACCPAgEAmwQAIZECAQCbBAAhkgIBAJ8EACGTAgIAnAQAIZUCAACdBJUCIpYCAQCbBAAhlwJAAJ4EACGYAkAAngQAIQsJAACxBAAgDwAAswQAIBAAALIEACCPAgEAAAABkQIBAAAAAZICAQAAAAGTAgIAAAABlQIAAACVAgKWAgEAAAABlwJAAAAAAZgCQAAAAAEJBgAAuAUAIA4AALkFACCPAgEAAAABlwJAAAAAAZgCQAAAAAGzAgEAAAABtAIBAAAAAbUCAQAAAAG2AgEAAAABAgAAANsCACAkAADHBgAgAwAAADQAICQAAMcGACAlAADLBgAgCwAAADQAIAYAALwEACAOAAC9BAAgHQAAywYAII8CAQCbBAAhlwJAAJ4EACGYAkAAngQAIbMCAQCbBAAhtAIBAJsEACG1AgEAnwQAIbYCAQCfBAAhCQYAALwEACAOAAC9BAAgjwIBAJsEACGXAkAAngQAIZgCQACeBAAhswIBAJsEACG0AgEAmwQAIbUCAQCfBAAhtgIBAJ8EACEOCAAAzgUAIAsAAOkEACAMAADqBAAgjwIBAAAAAZUCAAAAxgIClwJAAAAAAZgCQAAAAAG0AgEAAAABwgIBAAAAAcMCAQAAAAHEAgEAAAABxgICAAAAAccCAQAAAAHIAgAAAL8CAgIAAAASACAkAADUBgAgAwAAABIAICQAANQGACAlAADTBgAgAR0AAJIHADACAAAAEgAgHQAA0wYAIAIAAADHBAAgHQAA0gYAIAuPAgEAmwQAIZUCAADJBMYCIpcCQACeBAAhmAJAAJ4EACG0AgEAmwQAIcICAQCbBAAhwwIBAJ8EACHEAgEAnwQAIcYCAgCcBAAhxwIBAJ8EACHIAgAAygS_AiIOCAAAzQUAIAsAAM0EACAMAADOBAAgjwIBAJsEACGVAgAAyQTGAiKXAkAAngQAIZgCQACeBAAhtAIBAJsEACHCAgEAmwQAIcMCAQCfBAAhxAIBAJ8EACHGAgIAnAQAIccCAQCfBAAhyAIAAMoEvwIiDggAAM4FACALAADpBAAgDAAA6gQAII8CAQAAAAGVAgAAAMYCApcCQAAAAAGYAkAAAAABtAIBAAAAAcICAQAAAAHDAgEAAAABxAIBAAAAAcYCAgAAAAHHAgEAAAAByAIAAAC_AgILCQAA2AQAIAoAAJwFACCPAgEAAAABkQIBAAAAAZUCAAAAvwIClwJAAAAAAboCAQAAAAG7AgEAAAABvAKAAAAAAb0CCAAAAAG_AgEAAAABAgAAACYAICQAAN0GACADAAAAJgAgJAAA3QYAICUAANwGACABHQAAkQcAMAIAAAAmACAdAADcBgAgAgAAAJcFACAdAADbBgAgCY8CAQCbBAAhkQIBAJsEACGVAgAAygS_AiKXAkAAngQAIboCAQCfBAAhuwIBAJ8EACG8AoAAAAABvQIIANQEACG_AgEAmwQAIQsJAADWBAAgCgAAmgUAII8CAQCbBAAhkQIBAJsEACGVAgAAygS_AiKXAkAAngQAIboCAQCfBAAhuwIBAJ8EACG8AoAAAAABvQIIANQEACG_AgEAmwQAIQsJAADYBAAgCgAAnAUAII8CAQAAAAGRAgEAAAABlQIAAAC_AgKXAkAAAAABugIBAAAAAbsCAQAAAAG8AoAAAAABvQIIAAAAAb8CAQAAAAEGBgAA7wUAII8CAQAAAAGXAkAAAAABmAJAAAAAAbYCAQAAAAHaAgEAAAABAgAAAAkAICQAAOkGACADAAAACQAgJAAA6QYAICUAAOgGACABHQAAkAcAMAsDAADEAwAgBgAAwgMAIIwCAACTBAAwjQIAAAcAEI4CAACTBAAwjwIBAAAAAZcCQAC_AwAhmAJAAL8DACG2AgEAugMAIdkCAQC6AwAh2gIBAAAAAQIAAAAJACAdAADoBgAgAgAAAOYGACAdAADnBgAgCYwCAADlBgAwjQIAAOYGABCOAgAA5QYAMI8CAQC6AwAhlwJAAL8DACGYAkAAvwMAIbYCAQC6AwAh2QIBALoDACHaAgEAugMAIQmMAgAA5QYAMI0CAADmBgAQjgIAAOUGADCPAgEAugMAIZcCQAC_AwAhmAJAAL8DACG2AgEAugMAIdkCAQC6AwAh2gIBALoDACEFjwIBAJsEACGXAkAAngQAIZgCQACeBAAhtgIBAJsEACHaAgEAmwQAIQYGAADkBQAgjwIBAJsEACGXAkAAngQAIZgCQACeBAAhtgIBAJsEACHaAgEAmwQAIQYGAADvBQAgjwIBAAAAAZcCQAAAAAGYAkAAAAABtgIBAAAAAdoCAQAAAAEMjwIBAAAAAZcCQAAAAAGYAkAAAAABwgIBAAAAAeACAQAAAAHhAgEAAAAB4gIBAAAAAeMCAQAAAAHkAkAAAAAB5QJAAAAAAeYCAQAAAAHnAgEAAAABAgAAAAUAICQAAPUGACADAAAABQAgJAAA9QYAICUAAPQGACABHQAAjwcAMBEDAADEAwAgjAIAAJQEADCNAgAAAwAQjgIAAJQEADCPAgEAAAABlwJAAL8DACGYAkAAvwMAIbICAQC6AwAhwgIBALoDACHgAgEAugMAIeECAQC7AwAh4gIBALsDACHjAgEAuwMAIeQCQAC-AwAh5QJAAL4DACHmAgEAuwMAIecCAQC7AwAhAgAAAAUAIB0AAPQGACACAAAA8gYAIB0AAPMGACAQjAIAAPEGADCNAgAA8gYAEI4CAADxBgAwjwIBALoDACGXAkAAvwMAIZgCQAC_AwAhsgIBALoDACHCAgEAugMAIeACAQC6AwAh4QIBALsDACHiAgEAuwMAIeMCAQC7AwAh5AJAAL4DACHlAkAAvgMAIeYCAQC7AwAh5wIBALsDACEQjAIAAPEGADCNAgAA8gYAEI4CAADxBgAwjwIBALoDACGXAkAAvwMAIZgCQAC_AwAhsgIBALoDACHCAgEAugMAIeACAQC6AwAh4QIBALsDACHiAgEAuwMAIeMCAQC7AwAh5AJAAL4DACHlAkAAvgMAIeYCAQC7AwAh5wIBALsDACEMjwIBAJsEACGXAkAAngQAIZgCQACeBAAhwgIBAJsEACHgAgEAmwQAIeECAQCfBAAh4gIBAJ8EACHjAgEAnwQAIeQCQAC4BAAh5QJAALgEACHmAgEAnwQAIecCAQCfBAAhDI8CAQCbBAAhlwJAAJ4EACGYAkAAngQAIcICAQCbBAAh4AIBAJsEACHhAgEAnwQAIeICAQCfBAAh4wIBAJ8EACHkAkAAuAQAIeUCQAC4BAAh5gIBAJ8EACHnAgEAnwQAIQyPAgEAAAABlwJAAAAAAZgCQAAAAAHCAgEAAAAB4AIBAAAAAeECAQAAAAHiAgEAAAAB4wIBAAAAAeQCQAAAAAHlAkAAAAAB5gIBAAAAAecCAQAAAAEEJAAA6gYAMPMCAADrBgAw9QIAAO0GACD5AgAA7gYAMAQkAADeBgAw8wIAAN8GADD1AgAA4QYAIPkCAADiBgAwBCQAANUGADDzAgAA1gYAMPUCAADYBgAg-QIAAJMFADAEJAAAzAYAMPMCAADNBgAw9QIAAM8GACD5AgAAwwQAMAMkAADHBgAg8wIAAMgGACD5AgAA2wIAIAQkAAC-BgAw8wIAAL8GADD1AgAAwQYAIPkCAACoBAAwBCQAALIGADDzAgAAswYAMPUCAAC1BgAg-QIAALYGADAEJAAApgYAMPMCAACnBgAw9QIAAKkGACD5AgAAqgYAMAQkAACdBgAw8wIAAJ4GADD1AgAAoAYAIPkCAACDBQAwBCQAAJEGADDzAgAAkgYAMPUCAACUBgAg-QIAAJUGADAAAAAFAwAAvQUAIAYAALsFACAOAAC8BQAgtQIAAJUEACC2AgAAlQQAIAAAAAAABwUAAI4HACAIAACDBwAgCwAAjAcAIAwAAIIHACARAACEBwAgEwAAhwcAILUCAACVBAAgBwcAAL0FACAIAACDBwAgCwAAjAcAIAwAAI0HACDDAgAAlQQAIMQCAACVBAAgxwIAAJUEACAFBwAAvQUAIAkAAIkHACAPAACLBwAgEAAAhAcAIJICAACVBAAgAAYDAAC9BQAgCQAAiQcAIAoAAIoHACC6AgAAlQQAILsCAACVBAAgvAIAAJUEACACAwAAvQUAIAYAALsFACAMjwIBAAAAAZcCQAAAAAGYAkAAAAABwgIBAAAAAeACAQAAAAHhAgEAAAAB4gIBAAAAAeMCAQAAAAHkAkAAAAAB5QJAAAAAAeYCAQAAAAHnAgEAAAABBY8CAQAAAAGXAkAAAAABmAJAAAAAAbYCAQAAAAHaAgEAAAABCY8CAQAAAAGRAgEAAAABlQIAAAC_AgKXAkAAAAABugIBAAAAAbsCAQAAAAG8AoAAAAABvQIIAAAAAb8CAQAAAAELjwIBAAAAAZUCAAAAxgIClwJAAAAAAZgCQAAAAAG0AgEAAAABwgIBAAAAAcMCAQAAAAHEAgEAAAABxgICAAAAAccCAQAAAAHIAgAAAL8CAgiPAgEAAAABkQIBAAAAAZICAQAAAAGTAgIAAAABlQIAAACVAgKWAgEAAAABlwJAAAAAAZgCQAAAAAEHjwIBAAAAAZcCQAAAAAGYAkAAAAAB3wJAAAAAAegCAQAAAAHpAgEAAAAB6gIBAAAAAQaPAgEAAAABlwJAAAAAAZgCQAAAAAG1AgEAAAABtgIBAAAAAcoCAQAAAAEHjwIBAAAAAZcCQAAAAAGYAkAAAAABqAIBAAAAAcoCAQAAAAHLAgAAjQUAINwCAQAAAAEEjwIBAAAAAZcCQAAAAAGYAkAAAAAByQIBAAAAARUEAAD2BgAgBQAA9wYAIAgAAPoGACAOAAD5BgAgEQAA-wYAIBMAAP4GACAUAAD4BgAgFgAA_QYAIBcAAP8GACCPAgEAAAABlQIAAADwAgKXAkAAAAABmAJAAAAAAbYCAQAAAAHHAgEAAAAByQIBAAAAAdoCAQAAAAHrAiAAAAAB7AIBAAAAAe4CAAAA7gIC8AIgAAAAAQIAAAABACAkAACYBwAgAwAAAE4AICQAAJgHACAlAACcBwAgFwAAAE4AIAQAAIcGACAFAACIBgAgCAAAiwYAIA4AAIoGACARAACMBgAgEwAAjwYAIBQAAIkGACAWAACOBgAgFwAAkAYAIB0AAJwHACCPAgEAmwQAIZUCAACGBvACIpcCQACeBAAhmAJAAJ4EACG2AgEAnwQAIccCAQCfBAAhyQIBAJsEACHaAgEAmwQAIesCIAC3BAAh7AIBAJ8EACHuAgAAhQbuAiLwAiAAtwQAIRUEAACHBgAgBQAAiAYAIAgAAIsGACAOAACKBgAgEQAAjAYAIBMAAI8GACAUAACJBgAgFgAAjgYAIBcAAJAGACCPAgEAmwQAIZUCAACGBvACIpcCQACeBAAhmAJAAJ4EACG2AgEAnwQAIccCAQCfBAAhyQIBAJsEACHaAgEAmwQAIesCIAC3BAAh7AIBAJ8EACHuAgAAhQbuAiLwAiAAtwQAIRUFAAD3BgAgCAAA-gYAIA4AAPkGACARAAD7BgAgEwAA_gYAIBQAAPgGACAVAAD8BgAgFgAA_QYAIBcAAP8GACCPAgEAAAABlQIAAADwAgKXAkAAAAABmAJAAAAAAbYCAQAAAAHHAgEAAAAByQIBAAAAAdoCAQAAAAHrAiAAAAAB7AIBAAAAAe4CAAAA7gIC8AIgAAAAAQIAAAABACAkAACdBwAgAwAAAE4AICQAAJ0HACAlAAChBwAgFwAAAE4AIAUAAIgGACAIAACLBgAgDgAAigYAIBEAAIwGACATAACPBgAgFAAAiQYAIBUAAI0GACAWAACOBgAgFwAAkAYAIB0AAKEHACCPAgEAmwQAIZUCAACGBvACIpcCQACeBAAhmAJAAJ4EACG2AgEAnwQAIccCAQCfBAAhyQIBAJsEACHaAgEAmwQAIesCIAC3BAAh7AIBAJ8EACHuAgAAhQbuAiLwAiAAtwQAIRUFAACIBgAgCAAAiwYAIA4AAIoGACARAACMBgAgEwAAjwYAIBQAAIkGACAVAACNBgAgFgAAjgYAIBcAAJAGACCPAgEAmwQAIZUCAACGBvACIpcCQACeBAAhmAJAAJ4EACG2AgEAnwQAIccCAQCfBAAhyQIBAJsEACHaAgEAmwQAIesCIAC3BAAh7AIBAJ8EACHuAgAAhQbuAiLwAiAAtwQAIRUFAACzBQAgCAAA2gUAIAsAALQFACAMAAC2BQAgEQAAtQUAII8CAQAAAAGVAgAAANYCApcCQAAAAAGYAkAAAAABtQIBAAAAAcACAgAAAAHCAgEAAAABygIBAAAAAcsCAACyBQAgzAJAAAAAAc0CAQAAAAHOAiAAAAAB0AIAAADQAgLRAgEAAAAB0gICAAAAAdQCAAAA1AICAgAAAA0AICQAAKIHACADAAAACwAgJAAAogcAICUAAKYHACAXAAAACwAgBQAA-gQAIAgAANkFACALAAD7BAAgDAAA_QQAIBEAAPwEACAdAACmBwAgjwIBAJsEACGVAgAA-ATWAiKXAkAAngQAIZgCQACeBAAhtQIBAJ8EACHAAgIAnAQAIcICAQCbBAAhygIBAJsEACHLAgAA9QQAIMwCQACeBAAhzQIBAJsEACHOAiAAtwQAIdACAAD2BNACItECAQCbBAAh0gICAJwEACHUAgAA9wTUAiIVBQAA-gQAIAgAANkFACALAAD7BAAgDAAA_QQAIBEAAPwEACCPAgEAmwQAIZUCAAD4BNYCIpcCQACeBAAhmAJAAJ4EACG1AgEAnwQAIcACAgCcBAAhwgIBAJsEACHKAgEAmwQAIcsCAAD1BAAgzAJAAJ4EACHNAgEAmwQAIc4CIAC3BAAh0AIAAPYE0AIi0QIBAJsEACHSAgIAnAQAIdQCAAD3BNQCIhUEAAD2BgAgCAAA-gYAIA4AAPkGACARAAD7BgAgEwAA_gYAIBQAAPgGACAVAAD8BgAgFgAA_QYAIBcAAP8GACCPAgEAAAABlQIAAADwAgKXAkAAAAABmAJAAAAAAbYCAQAAAAHHAgEAAAAByQIBAAAAAdoCAQAAAAHrAiAAAAAB7AIBAAAAAe4CAAAA7gIC8AIgAAAAAQIAAAABACAkAACnBwAgD48CAQAAAAGVAgAAANYCApcCQAAAAAGYAkAAAAABtQIBAAAAAcACAgAAAAHCAgEAAAABygIBAAAAAcsCAACyBQAgzAJAAAAAAc0CAQAAAAHOAiAAAAAB0AIAAADQAgLSAgIAAAAB1AIAAADUAgIDAAAATgAgJAAApwcAICUAAKwHACAXAAAATgAgBAAAhwYAIAgAAIsGACAOAACKBgAgEQAAjAYAIBMAAI8GACAUAACJBgAgFQAAjQYAIBYAAI4GACAXAACQBgAgHQAArAcAII8CAQCbBAAhlQIAAIYG8AIilwJAAJ4EACGYAkAAngQAIbYCAQCfBAAhxwIBAJ8EACHJAgEAmwQAIdoCAQCbBAAh6wIgALcEACHsAgEAnwQAIe4CAACFBu4CIvACIAC3BAAhFQQAAIcGACAIAACLBgAgDgAAigYAIBEAAIwGACATAACPBgAgFAAAiQYAIBUAAI0GACAWAACOBgAgFwAAkAYAII8CAQCbBAAhlQIAAIYG8AIilwJAAJ4EACGYAkAAngQAIbYCAQCfBAAhxwIBAJ8EACHJAgEAmwQAIdoCAQCbBAAh6wIgALcEACHsAgEAnwQAIe4CAACFBu4CIvACIAC3BAAhFQQAAPYGACAFAAD3BgAgCAAA-gYAIA4AAPkGACARAAD7BgAgEwAA_gYAIBQAAPgGACAVAAD8BgAgFwAA_wYAII8CAQAAAAGVAgAAAPACApcCQAAAAAGYAkAAAAABtgIBAAAAAccCAQAAAAHJAgEAAAAB2gIBAAAAAesCIAAAAAHsAgEAAAAB7gIAAADuAgLwAiAAAAABAgAAAAEAICQAAK0HACADAAAATgAgJAAArQcAICUAALEHACAXAAAATgAgBAAAhwYAIAUAAIgGACAIAACLBgAgDgAAigYAIBEAAIwGACATAACPBgAgFAAAiQYAIBUAAI0GACAXAACQBgAgHQAAsQcAII8CAQCbBAAhlQIAAIYG8AIilwJAAJ4EACGYAkAAngQAIbYCAQCfBAAhxwIBAJ8EACHJAgEAmwQAIdoCAQCbBAAh6wIgALcEACHsAgEAnwQAIe4CAACFBu4CIvACIAC3BAAhFQQAAIcGACAFAACIBgAgCAAAiwYAIA4AAIoGACARAACMBgAgEwAAjwYAIBQAAIkGACAVAACNBgAgFwAAkAYAII8CAQCbBAAhlQIAAIYG8AIilwJAAJ4EACGYAkAAngQAIbYCAQCfBAAhxwIBAJ8EACHJAgEAmwQAIdoCAQCbBAAh6wIgALcEACHsAgEAnwQAIe4CAACFBu4CIvACIAC3BAAhCgMAALoFACAOAAC5BQAgjwIBAAAAAZcCQAAAAAGYAkAAAAABsgIBAAAAAbMCAQAAAAG0AgEAAAABtQIBAAAAAbYCAQAAAAECAAAA2wIAICQAALIHACADAAAANAAgJAAAsgcAICUAALYHACAMAAAANAAgAwAAvgQAIA4AAL0EACAdAAC2BwAgjwIBAJsEACGXAkAAngQAIZgCQACeBAAhsgIBAJsEACGzAgEAmwQAIbQCAQCbBAAhtQIBAJ8EACG2AgEAnwQAIQoDAAC-BAAgDgAAvQQAII8CAQCbBAAhlwJAAJ4EACGYAkAAngQAIbICAQCbBAAhswIBAJsEACG0AgEAmwQAIbUCAQCfBAAhtgIBAJ8EACEVBAAA9gYAIAUAAPcGACAIAAD6BgAgDgAA-QYAIBEAAPsGACATAAD-BgAgFAAA-AYAIBUAAPwGACAWAAD9BgAgjwIBAAAAAZUCAAAA8AIClwJAAAAAAZgCQAAAAAG2AgEAAAABxwIBAAAAAckCAQAAAAHaAgEAAAAB6wIgAAAAAewCAQAAAAHuAgAAAO4CAvACIAAAAAECAAAAAQAgJAAAtwcAIAMAAABOACAkAAC3BwAgJQAAuwcAIBcAAABOACAEAACHBgAgBQAAiAYAIAgAAIsGACAOAACKBgAgEQAAjAYAIBMAAI8GACAUAACJBgAgFQAAjQYAIBYAAI4GACAdAAC7BwAgjwIBAJsEACGVAgAAhgbwAiKXAkAAngQAIZgCQACeBAAhtgIBAJ8EACHHAgEAnwQAIckCAQCbBAAh2gIBAJsEACHrAiAAtwQAIewCAQCfBAAh7gIAAIUG7gIi8AIgALcEACEVBAAAhwYAIAUAAIgGACAIAACLBgAgDgAAigYAIBEAAIwGACATAACPBgAgFAAAiQYAIBUAAI0GACAWAACOBgAgjwIBAJsEACGVAgAAhgbwAiKXAkAAngQAIZgCQACeBAAhtgIBAJ8EACHHAgEAnwQAIckCAQCbBAAh2gIBAJsEACHrAiAAtwQAIewCAQCfBAAh7gIAAIUG7gIi8AIgALcEACEKAwAAugUAIAYAALgFACCPAgEAAAABlwJAAAAAAZgCQAAAAAGyAgEAAAABswIBAAAAAbQCAQAAAAG1AgEAAAABtgIBAAAAAQIAAADbAgAgJAAAvAcAIAMAAAA0ACAkAAC8BwAgJQAAwAcAIAwAAAA0ACADAAC-BAAgBgAAvAQAIB0AAMAHACCPAgEAmwQAIZcCQACeBAAhmAJAAJ4EACGyAgEAmwQAIbMCAQCbBAAhtAIBAJsEACG1AgEAnwQAIbYCAQCfBAAhCgMAAL4EACAGAAC8BAAgjwIBAJsEACGXAkAAngQAIZgCQACeBAAhsgIBAJsEACGzAgEAmwQAIbQCAQCbBAAhtQIBAJ8EACG2AgEAnwQAIRUEAAD2BgAgBQAA9wYAIA4AAPkGACARAAD7BgAgEwAA_gYAIBQAAPgGACAVAAD8BgAgFgAA_QYAIBcAAP8GACCPAgEAAAABlQIAAADwAgKXAkAAAAABmAJAAAAAAbYCAQAAAAHHAgEAAAAByQIBAAAAAdoCAQAAAAHrAiAAAAAB7AIBAAAAAe4CAAAA7gIC8AIgAAAAAQIAAAABACAkAADBBwAgBwMAAO4FACCPAgEAAAABlwJAAAAAAZgCQAAAAAG2AgEAAAAB2QIBAAAAAdoCAQAAAAECAAAACQAgJAAAwwcAIA8HAADoBAAgCAAAzgUAIAwAAOoEACCPAgEAAAABkAIBAAAAAZUCAAAAxgIClwJAAAAAAZgCQAAAAAG0AgEAAAABwgIBAAAAAcMCAQAAAAHEAgEAAAABxgICAAAAAccCAQAAAAHIAgAAAL8CAgIAAAASACAkAADFBwAgAwAAABAAICQAAMUHACAlAADJBwAgEQAAABAAIAcAAMwEACAIAADNBQAgDAAAzgQAIB0AAMkHACCPAgEAmwQAIZACAQCbBAAhlQIAAMkExgIilwJAAJ4EACGYAkAAngQAIbQCAQCbBAAhwgIBAJsEACHDAgEAnwQAIcQCAQCfBAAhxgICAJwEACHHAgEAnwQAIcgCAADKBL8CIg8HAADMBAAgCAAAzQUAIAwAAM4EACCPAgEAmwQAIZACAQCbBAAhlQIAAMkExgIilwJAAJ4EACGYAkAAngQAIbQCAQCbBAAhwgIBAJsEACHDAgEAnwQAIcQCAQCfBAAhxgICAJwEACHHAgEAnwQAIcgCAADKBL8CIgaPAgEAAAABlwJAAAAAAZgCQAAAAAG_AgEAAAABwAIIAAAAAcECAgAAAAEIjwIBAAAAAZACAQAAAAGSAgEAAAABkwICAAAAAZUCAAAAlQIClgIBAAAAAZcCQAAAAAGYAkAAAAABDwcAAOgEACAIAADOBQAgCwAA6QQAII8CAQAAAAGQAgEAAAABlQIAAADGAgKXAkAAAAABmAJAAAAAAbQCAQAAAAHCAgEAAAABwwIBAAAAAcQCAQAAAAHGAgIAAAABxwIBAAAAAcgCAAAAvwICAgAAABIAICQAAMwHACADAAAAEAAgJAAAzAcAICUAANAHACARAAAAEAAgBwAAzAQAIAgAAM0FACALAADNBAAgHQAA0AcAII8CAQCbBAAhkAIBAJsEACGVAgAAyQTGAiKXAkAAngQAIZgCQACeBAAhtAIBAJsEACHCAgEAmwQAIcMCAQCfBAAhxAIBAJ8EACHGAgIAnAQAIccCAQCfBAAhyAIAAMoEvwIiDwcAAMwEACAIAADNBQAgCwAAzQQAII8CAQCbBAAhkAIBAJsEACGVAgAAyQTGAiKXAkAAngQAIZgCQACeBAAhtAIBAJsEACHCAgEAmwQAIcMCAQCfBAAhxAIBAJ8EACHGAgIAnAQAIccCAQCfBAAhyAIAAMoEvwIiCY8CAQAAAAGVAgAAAL8CApcCQAAAAAGyAgEAAAABugIBAAAAAbsCAQAAAAG8AoAAAAABvQIIAAAAAb8CAQAAAAEVBAAA9gYAIAUAAPcGACAIAAD6BgAgDgAA-QYAIBEAAPsGACAUAAD4BgAgFQAA_AYAIBYAAP0GACAXAAD_BgAgjwIBAAAAAZUCAAAA8AIClwJAAAAAAZgCQAAAAAG2AgEAAAABxwIBAAAAAckCAQAAAAHaAgEAAAAB6wIgAAAAAewCAQAAAAHuAgAAAO4CAvACIAAAAAECAAAAAQAgJAAA0gcAIAMAAABOACAkAADSBwAgJQAA1gcAIBcAAABOACAEAACHBgAgBQAAiAYAIAgAAIsGACAOAACKBgAgEQAAjAYAIBQAAIkGACAVAACNBgAgFgAAjgYAIBcAAJAGACAdAADWBwAgjwIBAJsEACGVAgAAhgbwAiKXAkAAngQAIZgCQACeBAAhtgIBAJ8EACHHAgEAnwQAIckCAQCbBAAh2gIBAJsEACHrAiAAtwQAIewCAQCfBAAh7gIAAIUG7gIi8AIgALcEACEVBAAAhwYAIAUAAIgGACAIAACLBgAgDgAAigYAIBEAAIwGACAUAACJBgAgFQAAjQYAIBYAAI4GACAXAACQBgAgjwIBAJsEACGVAgAAhgbwAiKXAkAAngQAIZgCQACeBAAhtgIBAJ8EACHHAgEAnwQAIckCAQCbBAAh2gIBAJsEACHrAiAAtwQAIewCAQCfBAAh7gIAAIUG7gIi8AIgALcEACEHjwIBAAAAAZcCQAAAAAGYAkAAAAABqAIBAAAAAcoCAQAAAAHLAgAAjQUAINsCAQAAAAEDAAAABwAgJAAAwwcAICUAANoHACAJAAAABwAgAwAA4wUAIB0AANoHACCPAgEAmwQAIZcCQACeBAAhmAJAAJ4EACG2AgEAmwQAIdkCAQCbBAAh2gIBAJsEACEHAwAA4wUAII8CAQCbBAAhlwJAAJ4EACGYAkAAngQAIbYCAQCbBAAh2QIBAJsEACHaAgEAmwQAIQ-PAgEAAAABlQIAAADWAgKXAkAAAAABmAJAAAAAAbUCAQAAAAHAAgIAAAABygIBAAAAAcsCAACyBQAgzAJAAAAAAc0CAQAAAAHOAiAAAAAB0AIAAADQAgLRAgEAAAAB0gICAAAAAdQCAAAA1AICFQQAAPYGACAFAAD3BgAgCAAA-gYAIBEAAPsGACATAAD-BgAgFAAA-AYAIBUAAPwGACAWAAD9BgAgFwAA_wYAII8CAQAAAAGVAgAAAPACApcCQAAAAAGYAkAAAAABtgIBAAAAAccCAQAAAAHJAgEAAAAB2gIBAAAAAesCIAAAAAHsAgEAAAAB7gIAAADuAgLwAiAAAAABAgAAAAEAICQAANwHACAVBQAAswUAIAgAANoFACAMAAC2BQAgEQAAtQUAIBMAALcFACCPAgEAAAABlQIAAADWAgKXAkAAAAABmAJAAAAAAbUCAQAAAAHAAgIAAAABwgIBAAAAAcoCAQAAAAHLAgAAsgUAIMwCQAAAAAHNAgEAAAABzgIgAAAAAdACAAAA0AIC0QIBAAAAAdICAgAAAAHUAgAAANQCAgIAAAANACAkAADeBwAgAwAAAAsAICQAAN4HACAlAADiBwAgFwAAAAsAIAUAAPoEACAIAADZBQAgDAAA_QQAIBEAAPwEACATAAD-BAAgHQAA4gcAII8CAQCbBAAhlQIAAPgE1gIilwJAAJ4EACGYAkAAngQAIbUCAQCfBAAhwAICAJwEACHCAgEAmwQAIcoCAQCbBAAhywIAAPUEACDMAkAAngQAIc0CAQCbBAAhzgIgALcEACHQAgAA9gTQAiLRAgEAmwQAIdICAgCcBAAh1AIAAPcE1AIiFQUAAPoEACAIAADZBQAgDAAA_QQAIBEAAPwEACATAAD-BAAgjwIBAJsEACGVAgAA-ATWAiKXAkAAngQAIZgCQACeBAAhtQIBAJ8EACHAAgIAnAQAIcICAQCbBAAhygIBAJsEACHLAgAA9QQAIMwCQACeBAAhzQIBAJsEACHOAiAAtwQAIdACAAD2BNACItECAQCbBAAh0gICAJwEACHUAgAA9wTUAiIGjwIBAAAAAZECAQAAAAGXAkAAAAABmAJAAAAAAcACCAAAAAHBAgIAAAABFQUAALMFACAIAADaBQAgCwAAtAUAIBEAALUFACATAAC3BQAgjwIBAAAAAZUCAAAA1gIClwJAAAAAAZgCQAAAAAG1AgEAAAABwAICAAAAAcICAQAAAAHKAgEAAAABywIAALIFACDMAkAAAAABzQIBAAAAAc4CIAAAAAHQAgAAANACAtECAQAAAAHSAgIAAAAB1AIAAADUAgICAAAADQAgJAAA5AcAIBUEAAD2BgAgBQAA9wYAIAgAAPoGACAOAAD5BgAgEQAA-wYAIBMAAP4GACAVAAD8BgAgFgAA_QYAIBcAAP8GACCPAgEAAAABlQIAAADwAgKXAkAAAAABmAJAAAAAAbYCAQAAAAHHAgEAAAAByQIBAAAAAdoCAQAAAAHrAiAAAAAB7AIBAAAAAe4CAAAA7gIC8AIgAAAAAQIAAAABACAkAADmBwAgAwAAAAsAICQAAOQHACAlAADqBwAgFwAAAAsAIAUAAPoEACAIAADZBQAgCwAA-wQAIBEAAPwEACATAAD-BAAgHQAA6gcAII8CAQCbBAAhlQIAAPgE1gIilwJAAJ4EACGYAkAAngQAIbUCAQCfBAAhwAICAJwEACHCAgEAmwQAIcoCAQCbBAAhywIAAPUEACDMAkAAngQAIc0CAQCbBAAhzgIgALcEACHQAgAA9gTQAiLRAgEAmwQAIdICAgCcBAAh1AIAAPcE1AIiFQUAAPoEACAIAADZBQAgCwAA-wQAIBEAAPwEACATAAD-BAAgjwIBAJsEACGVAgAA-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-gYAIA4AAPkGACATAAD-BgAgFAAA-AYAIBUAAPwGACAWAAD9BgAgFwAA_wYAII8CAQAAAAGVAgAAAPACApcCQAAAAAGYAkAAAAABtgIBAAAAAccCAQAAAAHJAgEAAAAB2gIBAAAAAesCIAAAAAHsAgEAAAAB7gIAAADuAgLwAiAAAAABAgAAAAEAICQAAPkHACAIjwIBAAAAAZACAQAAAAGRAgEAAAABkwICAAAAAZUCAAAAlQIClgIBAAAAAZcCQAAAAAGYAkAAAAABAwAAAB4AICQAAPUHACAlAAD-BwAgDgAAAB4AIAcAAKAEACAJAAChBAAgDwAAogQAIB0AAP4HACCPAgEAmwQAIZACAQCbBAAhkQIBAJsEACGSAgEAnwQAIZMCAgCcBAAhlQIAAJ0ElQIilgIBAJsEACGXAkAAngQAIZgCQACeBAAhDAcAAKAEACAJAAChBAAgDwAAogQAII8CAQCbBAAhkAIBAJsEACGRAgEAmwQAIZICAQCfBAAhkwICAJwEACGVAgAAnQSVAiKWAgEAmwQAIZcCQACeBAAhmAJAAJ4EACEDAAAACwAgJAAA9wcAICUAAIEIACAXAAAACwAgBQAA-gQAIAgAANkFACALAAD7BAAgDAAA_QQAIBMAAP4EACAdAACBCAAgjwIBAJsEACGVAgAA-ATWAiKXAkAAngQAIZgCQACeBAAhtQIBAJ8EACHAAgIAnAQAIcICAQCbBAAhygIBAJsEACHLAgAA9QQAIMwCQACeBAAhzQIBAJsEACHOAiAAtwQAIdACAAD2BNACItECAQCbBAAh0gICAJwEACHUAgAA9wTUAiIVBQAA-gQAIAgAANkFACALAAD7BAAgDAAA_QQAIBMAAP4EACCPAgEAmwQAIZUCAAD4BNYCIpcCQACeBAAhmAJAAJ4EACG1AgEAnwQAIcACAgCcBAAhwgIBAJsEACHKAgEAmwQAIcsCAAD1BAAgzAJAAJ4EACHNAgEAmwQAIc4CIAC3BAAh0AIAAPYE0AIi0QIBAJsEACHSAgIAnAQAIdQCAAD3BNQCIgMAAABOACAkAAD5BwAgJQAAhAgAIBcAAABOACAEAACHBgAgBQAAiAYAIAgAAIsGACAOAACKBgAgEwAAjwYAIBQAAIkGACAVAACNBgAgFgAAjgYAIBcAAJAGACAdAACECAAgjwIBAJsEACGVAgAAhgbwAiKXAkAAngQAIZgCQACeBAAhtgIBAJ8EACHHAgEAnwQAIckCAQCbBAAh2gIBAJsEACHrAiAAtwQAIewCAQCfBAAh7gIAAIUG7gIi8AIgALcEACEVBAAAhwYAIAUAAIgGACAIAACLBgAgDgAAigYAIBMAAI8GACAUAACJBgAgFQAAjQYAIBYAAI4GACAXAACQBgAgjwIBAJsEACGVAgAAhgbwAiKXAkAAngQAIZgCQACeBAAhtgIBAJ8EACHHAgEAnwQAIckCAQCbBAAh2gIBAJsEACHrAiAAtwQAIewCAQCfBAAh7gIAAIUG7gIi8AIgALcEACELBAYCBQoDCDUFDQATDjMGETYLEz8NFDIIFToQFj4RF0MSAQMAAQMDAAEGDgQNAA8HBQADCAAFCx0HDCcIDQAOESELEysNBAMAAQYPBA0ACg4TBgUHAAEIAAULFwcMGQgNAAkCCQAECgAGAwMAAQkABAoABgELGgACBhsADhwABQcAAQkABA0ADA8iCxAjCwEQJAACCSwEEgABBAstAAwvABEuABMwAAEGMQABAwABAQMAAQEDAAEJBEQABUUADkcAEUgAE0sAFEYAFUkAFkoAF0wAAAAAAw0AGCoAGSsAGgAAAAMNABgqABkrABoBAwABAQMAAQMNAB8qACArACEAAAADDQAfKgAgKwAhAQMAAQEDAAEDDQAmKgAnKwAoAAAAAw0AJioAJysAKAAAAAMNAC4qAC8rADAAAAADDQAuKgAvKwAwAgmzAQQSAAECCbkBBBIAAQMNADUqADYrADcAAAADDQA1KgA2KwA3AQMAAQEDAAEDDQA8KgA9KwA-AAAAAw0APCoAPSsAPgEDAAEBAwABAw0AQyoARCsARQAAAAMNAEMqAEQrAEUCBQADCAAFAgUAAwgABQUNAEoqAE0rAE6cAQBLnQEATAAAAAAABQ0ASioATSsATpwBAEudAQBMAQMAAQEDAAEDDQBTKgBUKwBVAAAAAw0AUyoAVCsAVQIHAAEIAAUCBwABCAAFBQ0AWioAXSsAXpwBAFudAQBcAAAAAAAFDQBaKgBdKwBenAEAW50BAFwCCQAECgAGAgkABAoABgUNAGMqAGYrAGecAQBknQEAZQAAAAAABQ0AYyoAZisAZ5wBAGSdAQBlAwMAAQkABAoABgMDAAEJAAQKAAYFDQBsKgBvKwBwnAEAbZ0BAG4AAAAAAAUNAGwqAG8rAHCcAQBtnQEAbgEDAAEBAwABAw0AdSoAdisAdwAAAAMNAHUqAHYrAHcAAAMNAHwqAH0rAH4AAAADDQB8KgB9KwB-AwcAAQkABA-QAwsDBwABCQAED5YDCwUNAIMBKgCGASsAhwGcAQCEAZ0BAIUBAAAAAAAFDQCDASoAhgErAIcBnAEAhAGdAQCFARgCARlNARpQARtRARxSAR5UAR9WFCBXFSFZASJbFCNcFiZdASdeAShfFCxiFy1jGy5kEC9lEDBmEDFnEDJoEDNqEDRsFDVtHDZvEDdxFDhyHTlzEDp0EDt1FDx4Hj15Ij56Aj97AkB8AkF9AkJ-AkOAAQJEggEURYMBI0aFAQJHhwEUSIgBJEmJAQJKigECS4sBFEyOASVNjwEpTpEBKk-SASpQlQEqUZYBKlKXASpTmQEqVJsBFFWcAStWngEqV6ABFFihASxZogEqWqMBKlukARRcpwEtXagBMV6pAQ1fqgENYKsBDWGsAQ1irQENY68BDWSxARRlsgEyZrUBDWe3ARRouAEzaboBDWq7AQ1rvAEUbL8BNG3AAThuwQEDb8IBA3DDAQNxxAEDcsUBA3PHAQN0yQEUdcoBOXbMAQN3zgEUeM8BOnnQAQN60QEDe9IBFHzVATt91gE_ftcBEX_YARGAAdkBEYEB2gERggHbARGDAd0BEYQB3wEUhQHgAUCGAeIBEYcB5AEUiAHlAUGJAeYBEYoB5wERiwHoARSMAesBQo0B7AFGjgHtAQSPAe4BBJAB7wEEkQHwAQSSAfEBBJMB8wEElAH1ARSVAfYBR5YB-AEElwH6ARSYAfsBSJkB_AEEmgH9AQSbAf4BFJ4BgQJJnwGCAk-gAYMCEqEBhAISogGFAhKjAYYCEqQBhwISpQGJAhKmAYsCFKcBjAJQqAGOAhKpAZACFKoBkQJRqwGSAhKsAZMCEq0BlAIUrgGXAlKvAZgCVrABmQIGsQGaAgayAZsCBrMBnAIGtAGdAga1AZ8CBrYBoQIUtwGiAle4AaQCBrkBpgIUugGnAli7AagCBrwBqQIGvQGqAhS-Aa0CWb8BrgJfwAGvAgfBAbACB8IBsQIHwwGyAgfEAbMCB8UBtQIHxgG3AhTHAbgCYMgBugIHyQG8AhTKAb0CYcsBvgIHzAG_AgfNAcACFM4BwwJizwHEAmjQAcUCCNEBxgII0gHHAgjTAcgCCNQByQII1QHLAgjWAc0CFNcBzgJp2AHQAgjZAdICFNoB0wJq2wHUAgjcAdUCCN0B1gIU3gHZAmvfAdoCceAB3AIF4QHdAgXiAd8CBeMB4AIF5AHhAgXlAeMCBeYB5QIU5wHmAnLoAegCBekB6gIU6gHrAnPrAewCBewB7QIF7QHuAhTuAfECdO8B8gJ48AH0AnnxAfUCefIB-AJ58wH5Ann0AfoCefUB_AJ59gH-AhT3Af8CevgBgAN5-QGBAxT6AYQDe_sBhQN__AGGAwv9AYcDC_4BiAML_wGJAwuAAooDC4ECjAMLggKOAxSDAo8DgAGEApIDC4UClAMUhgKVA4EBhwKXAwuIApgDC4kCmQMUigKcA4IBiwKdA4gB"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  BlogScalarFieldEnum: () => BlogScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  DocumentEmbeddingScalarFieldEnum: () => DocumentEmbeddingScalarFieldEnum,
  HighlightScalarFieldEnum: () => HighlightScalarFieldEnum,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  MealScalarFieldEnum: () => MealScalarFieldEnum,
  ModelName: () => ModelName,
  NewsletterScalarFieldEnum: () => NewsletterScalarFieldEnum,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  OrderitemScalarFieldEnum: () => OrderitemScalarFieldEnum,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProviderProfileScalarFieldEnum: () => ProviderProfileScalarFieldEnum,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.7.0",
  engine: "75cbdc1eb7150937890ad5465d861175c6624711"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Blog: "Blog",
  Category: "Category",
  Highlight: "Highlight",
  Meal: "Meal",
  Newsletter: "Newsletter",
  Order: "Order",
  Orderitem: "Orderitem",
  Payment: "Payment",
  ProviderProfile: "ProviderProfile",
  DocumentEmbedding: "DocumentEmbedding",
  Review: "Review"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  bgimage: "bgimage",
  phone: "phone",
  role: "role",
  status: "status",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BlogScalarFieldEnum = {
  id: "id",
  title: "title",
  content: "content",
  images: "images",
  authorId: "authorId",
  mealid: "mealid",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  adminId: "adminId",
  name: "name",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var HighlightScalarFieldEnum = {
  id: "id",
  title: "title",
  description: "description",
  image: "image",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MealScalarFieldEnum = {
  id: "id",
  title: "title",
  description: "description",
  images: "images",
  price: "price",
  date: "date",
  location: "location",
  isAvailable: "isAvailable",
  dietaryPreference: "dietaryPreference",
  providerId: "providerId",
  category_name: "category_name",
  deliverycharge: "deliverycharge",
  cuisine: "cuisine",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var NewsletterScalarFieldEnum = {
  id: "id",
  email: "email",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  providerId: "providerId",
  first_name: "first_name",
  last_name: "last_name",
  status: "status",
  totalPrice: "totalPrice",
  phone: "phone",
  address: "address",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  paymentStatus: "paymentStatus"
};
var OrderitemScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  price: "price",
  quantity: "quantity",
  mealId: "mealId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  userId: "userId",
  mealId: "mealId",
  stripeEventId: "stripeEventId",
  transactionId: "transactionId",
  paymentGatewayData: "paymentGatewayData",
  amount: "amount",
  status: "status",
  orderId: "orderId",
  createdAt: "createdAt"
};
var ProviderProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  restaurantName: "restaurantName",
  address: "address",
  description: "description",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var DocumentEmbeddingScalarFieldEnum = {
  id: "id",
  chunkKey: "chunkKey",
  sourceType: "sourceType",
  sourceId: "sourceId",
  sourceLabel: "sourceLabel",
  content: "content",
  metadata: "metadata",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  mealId: "mealId",
  parentId: "parentId",
  rating: "rating",
  status: "status",
  comment: "comment",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/enums.ts
var Status = {
  activate: "activate",
  suspend: "suspend"
};
var PaymentStatus = {
  PAID: "PAID",
  UNPAID: "UNPAID",
  FREE: "FREE"
};

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app.ts
import express2 from "express";

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP, oAuthProxy } from "better-auth/plugins";

// src/app/utils/email.ts
import status2 from "http-status";
import nodemailer from "nodemailer";

// src/app/config/env.ts
import dotenv from "dotenv";
import status from "http-status";

// src/app/errorHelper/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/app/config/env.ts
dotenv.config();
var loadEnvVariables = () => {
  const requireEnvVariable = [
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "FRONTEND_URL",
    "PORT",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "EMAIL",
    "PASSWORD",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "NODE_ENV",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "OPENROUTER_API_KEY",
    "OPENROUTER_EMBEDDING_MODEL",
    "OPENROUTER_LLM_MODEL",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN"
  ];
  requireEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError_default(
        status.INTERNAL_SERVER_ERROR,
        `Server configuration error: The required environment variable "${variable}" is not set. Verify your .env file or deployment environment settings.`
      );
    }
  });
  return {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    PORT: process.env.PORT,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
    },
    EMAIL_SENDER: {
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS,
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_FROM: process.env.SMTP_FROM
    },
    STRIPE: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET
    },
    RAG: {
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
      OPENROUTER_EMBEDDING_MODEL: process.env.OPENROUTER_EMBEDDING_MODEL,
      OPENROUTER_LLM_MODEL: process.env.OPENROUTER_LLM_MODEL
    },
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN
  };
};
var envVars = loadEnvVariables();

// src/app/templates/htmlEmailTemplete.ts
function generateEmailTemplate(templateName, templateData) {
  const COLORS = {
    brand: "#ff5722",
    // main accent (carrot orange)
    highlight: "#ffe082",
    // highlight (lemon yellow)
    leaf: "#43a047",
    // green (fresh herb/leaf)
    background: "#f9fafc",
    // light, airy
    card: "#fffefb",
    // card background, light warm
    border: "#e0e0e0",
    // subtle border
    heading: "#2d2a31",
    // deep food brown/gray
    text: "#41392e",
    // appetizing brown
    subtext: "#7e7465",
    // muted brown
    error: "#e64a19",
    // for missing OTP, accent red-orange
    shadow: "rgba(255, 87, 34, 0.10)"
    // orange tint shadow
  };
  switch (templateName) {
    case "otp":
      return `
        <html>
          <body style="margin:0;padding:0;background:${COLORS.background};font-family:'Segoe UI','Montserrat',Arial,sans-serif;">
            <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:${COLORS.card};margin:48px auto 0 auto;border-radius:16px;box-shadow:0 10px 42px ${COLORS.shadow};border:1px solid ${COLORS.border};overflow:hidden;">
              <tr>
                <td style="padding:3em 2.2em 1.2em 2.2em;">
                  <div style="text-align:center;">
                    <img src="https://images.pexels.com/photos/36982119/pexels-photo-36982119.jpeg" alt="FoodHub" height="54" style="display:block;margin:0 auto 18px auto;border-radius:10px;box-shadow:0 2px 10px #f3d2b0;"/>
                    <h1 style="margin:0 0 10px 0;font-size:2.1em;font-weight:800;letter-spacing:-1px;color:${COLORS.brand};line-height:1.16;">
                      FoodHub Secure Verification
                    </h1>
                    <span style="display:inline-block;margin:0 auto 8px auto;font-size:1.19em;color:${COLORS.leaf};font-weight:700;">
                      One Step Away From Tasty Journeys!
                    </span>
                  </div>
                  <div style="margin:32px 0 22px 0;border-radius:15px;padding:28px 0;background:linear-gradient(92deg,#fff9ee 55%,${COLORS.highlight} 120%);border:1.5px dashed ${COLORS.brand};text-align:center;box-shadow:0 3px 22px #ffe9d5;">
                    <span style="
                      display:inline-block;
                      font-size:2.3em;
                      font-family:'Space Mono',monospace;
                      color:${COLORS.card};
                      background:linear-gradient(89deg,${COLORS.leaf} 14%,${COLORS.brand} 110%);
                      border-radius:10px;
                      padding:15px 56px;
                      font-weight:900;
                      letter-spacing:0.22em;
                      box-shadow:0 4px 18px 0 rgba(255,87,34,0.09);
                      ">
                      ${templateData.otp ? escapeStr(templateData.otp) : `<span style="color:${COLORS.error}">\u2022\u2022\u2022\u2022\u2022\u2022\u2022</span>`}
                    </span>
                  </div>
                  <p style="color:${COLORS.text};font-size:1.32em;line-height:1.66;margin:20px 0 24px 0;font-weight:500;">
                    Hi${templateData.name ? ` <b>${escapeStr(templateData.name)}</b>,` : ","}<br/>
                    Welcome to FoodHub! Please enter the above code to verify your email and continue to delightful food experiences.
                  </p>
                  <ul style="font-size:1em;color:${COLORS.subtext};margin:0 0 40px 14px;padding:0;">
                    <li style="margin-bottom:7px;">This OTP is valid for a limited time, so complete your verification promptly.</li>
                    <li style="margin-bottom:7px;">Keep your code confidential for account security.</li>
                  </ul>
                  <div style="margin:40px 0 0 0;text-align:center;">
                    <a href="https://foodhub.app" target="_blank" style="
                      display:inline-block;
                      padding:12px 42px;
                      background:linear-gradient(90deg,${COLORS.brand},${COLORS.leaf});
                      color:white;
                      text-decoration:none;
                      font-weight:700;
                      border-radius:7px;
                      font-size:1.07em;
                      letter-spacing:0.04em;
                      box-shadow:0 4px 14px rgba(67,160,71,0.13);
                      border:none;
                      ">
                      Explore FoodHub
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background:${COLORS.background};padding:1.3em 2.4em 1.38em 2.4em;text-align:center;border-top:1px solid ${COLORS.border};">
                  <span style="color:${COLORS.subtext};font-size:1.02em;">
                    If you did not request this, simply ignore this email.<br/>
                    Enjoy fresh discoveries with <strong style="color:${COLORS.brand}">FoodHub</strong>!
                  </span>
                  <div style="margin-top:15px;">
                    <span style="font-size:0.95em;color:#b6b2ad;">
                      &copy; ${(/* @__PURE__ */ new Date()).getFullYear()} FoodHub. All rights reserved.
                    </span>
                  </div>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;
    default:
      return `
        <html>
          <body style="margin:0;padding:0;background:${COLORS.background};font-family:'Segoe UI','Montserrat',Arial,sans-serif;">
            <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:${COLORS.card};margin:48px auto 0 auto;border-radius:16px;box-shadow:0 10px 42px ${COLORS.shadow};border:1px solid ${COLORS.border};overflow:hidden;">
              <tr>
                <td style="padding:2.6em 2.4em 1.5em 2.4em;">
                  <div style="text-align:center;">
                    <img src="https://images.pexels.com/photos/36982119/pexels-photo-36982119.jpeg" alt="FoodHub" height="48" style="display:block;margin:0 auto 24px auto;border-radius:10px;box-shadow:0 2px 10px #f3d2b0;" />
                  </div>
                  <h2 style="margin:0 0 10px 0;color:${COLORS.leaf};font-size:2.05em;font-weight:800;letter-spacing:-1px;text-align:center;">
                    FoodHub Notification
                  </h2>
                  <span style="display:block;font-size:1.16em;color:${COLORS.brand};margin-bottom:12px;text-align:center;font-weight:600;">
                    Discover. Taste. Enjoy.
                  </span>
                  <p style="font-size:1.10em;color:${COLORS.text};margin:12px 0 27px 0;text-align:center;">
                    You\u2019ve received a system message from FoodHub.
                  </p>
                  <div style="border:1px solid ${COLORS.border};border-radius:11px;padding:20px 22px;background:#fcf8ee;">
                    <p style="color:${COLORS.text};font-size:1.07em;line-height:1.7;margin:8px 0;">
                      This is an automated notification. For more delicious updates, visit FoodHub and enjoy a world of experiences!
                    </p>
                  </div>
                  <div style="margin:42px 0 16px 0;text-align:center;">
                    <a href="https://foodhub.app" target="_blank" style="
                      display:inline-block;
                      background:linear-gradient(90deg,${COLORS.leaf},${COLORS.brand});
                      color:white;
                      font-weight:700;
                      font-size:1.06em;
                      padding:11px 38px;
                      border-radius:8px;
                      text-decoration:none;
                      box-shadow:0 3px 12px 0 rgba(255,87,34,0.08);
                      border:none;">
                      Go to FoodHub
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background:${COLORS.background};padding:1.28em 2em 1.26em 2em;text-align:center;border-top:1px solid ${COLORS.border};">
                  <span style="color:${COLORS.subtext};font-size:0.97em;">
                    Thank you for being part of <strong style="color:${COLORS.brand}">FoodHub</strong>.
                  </span>
                  <div style="margin-top:13px;">
                    <span style="font-size:0.92em;color:#b6b2ad;">
                      &copy; ${(/* @__PURE__ */ new Date()).getFullYear()} FoodHub. All rights reserved.
                    </span>
                  </div>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;
  }
}
function escapeStr(str) {
  return str.replace(/[&<>"'`]/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "`": "&#96;"
  })[m]);
}

// src/app/utils/email.ts
var smtpConfig = {
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
  secure: Number(envVars.EMAIL_SENDER.SMTP_PORT) === 465,
  // true for 465, false for others
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS
  },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 15e3,
  greetingTimeout: 15e3,
  socketTimeout: 3e4
};
var transporter = nodemailer.createTransport(smtpConfig);
var sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments
}) => {
  try {
    const mailOptions = {
      from: `foodhub <${envVars.EMAIL_SENDER.SMTP_USER}>`,
      to,
      subject,
      html: generateEmailTemplate(templateName, templateData),
      attachments: attachments?.map(({ filename, content, contentType }) => ({
        filename,
        content,
        contentType
      }))
    };
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email Sending Error", {
      message: error?.message,
      code: error?.code,
      command: error?.command,
      responseCode: error?.responseCode
    });
    throw new AppError_default(status2.INTERNAL_SERVER_ERROR, "Failed to send email");
  }
};

// src/app/middleware/auth.const.ts
var UserRoles = {
  Admin: "Admin",
  Customer: "Customer",
  Provider: "Provider"
};

// src/app/lib/auth.ts
var auth = betterAuth({
  secret: envVars.BETTER_AUTH_SECRET,
  baseURL: envVars.FRONTEND_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [envVars.FRONTEND_URL],
  user: {
    additionalFields: {
      role: {
        type: ["Customer", "Provider", "Admin"],
        required: false,
        defaultValue: "Customer"
      },
      status: {
        type: ["activate", "suspend"],
        required: false,
        defaultValue: "activate"
      },
      phone: {
        type: "string",
        required: false
      },
      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true
      },
      bgimage: {
        type: "string",
        required: false
      },
      emailVerified: {
        type: "boolean",
        required: false
      }
    }
  },
  plugins: [
    oAuthProxy(),
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (user?.role === "Admin") {
            await prisma.user.update({
              where: {
                email
              },
              data: {
                emailVerified: true
              }
            });
          }
          if (user && !user.emailVerified) {
            await sendEmail({
              to: user.email,
              subject: "Verify your email address",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp
              }
            });
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (user) {
            await sendEmail({
              to: email,
              subject: "Password Reset OTP",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp
              }
            });
          }
        }
      },
      expiresIn: 10 * 60,
      otpLength: 6,
      resendStrategy: "rotate"
    })
  ],
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendOnSignIn: true
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true
    // requireEmailVerification: true
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    strategy: "jwt"
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      accessType: "offline",
      prompt: "select_account consent",
      redirectURI: `${envVars.FRONTEND_URL}/api/auth/callback/google`,
      mapProfileToUser: () => {
        return {
          role: UserRoles.Customer,
          status: Status.activate,
          emailVerified: true,
          bgimage: ""
        };
      }
    }
  },
  advanced: {
    // disableCSRFCheck: true,
    useSecureCookies: false,
    cookies: {
      state: {
        attributes: {
          sameSite: "lax",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      },
      sessionToken: {
        attributes: {
          sameSite: "lax",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      }
    }
  },
  redirectURLs: {
    signin: `${process.env.BETTER_AUTH_URL}`
  }
});

// src/app.ts
import { toNodeHandler } from "better-auth/node";

// src/app/middleware/notFound.ts
function Notfound(req, res) {
  res.status(404).json({ message: "route not found" });
}

// src/app.ts
import cookieParser from "cookie-parser";
import cors from "cors";

// src/app/middleware/globalErrorHandeller.ts
import status3 from "http-status";
function errorHandler(err, req, res, next) {
  let statusCode = status3.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let errorSources = [];
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = status3.BAD_REQUEST;
    message = "Validation Error";
    errorSources.push({ message: err.message });
  } else if (err?.code === "ETIMEDOUT" || err?.code === "PROTOCOL_TIMEOUT") {
    statusCode = status3.GATEWAY_TIMEOUT;
    message = "Database request timed out. Please retry after a short while.";
    errorSources.push({ message });
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode || status3.BAD_REQUEST;
    message = err.message;
    errorSources.push({ message: err.message });
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    // ডেভেলপমেন্ট মোডে থাকলে স্ট্যাক ট্রেস দেখতে পারেন
    stack: process.env.NODE_ENV === "development" ? err.stack : void 0
  });
}
var globalErrorHandeller_default = errorHandler;

// src/app/routes/index.route.ts
import { Router as Router13 } from "express";

// src/app/modules/meal/meal.route.ts
import { Router } from "express";

// src/app/middleware/auth.ts
import status4 from "http-status";

// src/app/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var CookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, { expiresIn }) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      success: true,
      data: decoded
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
var decodeToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodeToken
};

// src/app/middleware/auth.ts
var auth2 = (roles) => {
  return async (req, res, next) => {
    try {
      const sessionToken = CookieUtils.getCookie(req, "better-auth.session_token");
      const accessToken = CookieUtils.getCookie(req, "accessToken");
      if (sessionToken) {
        const betterSession = await auth.api.getSession({
          headers: req.headers
        });
        if (betterSession?.session) {
          const sessionData = await prisma.session.findFirst({
            where: {
              token: betterSession.session.token,
              expiresAt: { gt: /* @__PURE__ */ new Date() }
            },
            include: { user: true }
          });
          if (sessionData?.user) {
            const { user } = sessionData;
            handleSessionExpiryHeader(res, sessionData);
            validateUserStatus(user.status);
            validateUserRole(user.role, roles);
            req.user = {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              emailVerified: user.emailVerified,
              status: user.status,
              isActive: user.isActive
            };
            return next();
          }
        }
      }
      if (accessToken) {
        const verifiedToken = jwtUtils.verifyToken(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        if (verifiedToken.success && verifiedToken.data) {
          const userData = verifiedToken.data;
          validateUserRole(userData.role, roles);
          req.user = {
            id: userData.id,
            role: userData.role,
            email: userData.email,
            emailVerified: userData.emailVerified,
            isActive: userData.isActive,
            name: userData.name,
            status: userData.status
          };
          return next();
        }
      }
      throw new AppError_default(status4.UNAUTHORIZED, "Unauthorized! Please login to continue.");
    } catch (error) {
      next(new AppError_default(error.statusCode || status4.BAD_REQUEST, error.message));
    }
  };
};
var validateUserStatus = (userStatus) => {
  const forbiddenStatus = ["suspend"];
  if (forbiddenStatus.includes(userStatus)) {
    throw new AppError_default(status4.UNAUTHORIZED, "Access denied! Your account is not active.");
  }
};
var validateUserRole = (userRole, allowedRoles) => {
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    throw new AppError_default(status4.FORBIDDEN, "Forbidden! You don't have permission.");
  }
};
var handleSessionExpiryHeader = (res, session) => {
  const now = (/* @__PURE__ */ new Date()).getTime();
  const expiresAt = new Date(session.expiresAt).getTime();
  const createdAt = new Date(session.createdAt).getTime();
  const totalLife = expiresAt - createdAt;
  const remaining = expiresAt - now;
  const percentRemaining = remaining / totalLife * 100;
  if (percentRemaining < 20) {
    res.setHeader("X-Session-Refresh", "true");
    res.setHeader("X-Session-Expires-At", new Date(expiresAt).toISOString());
  }
};
var auth_default = auth2;

// src/app/modules/meal/meal.service.ts
import status5 from "http-status";

// src/app/utils/parseDate.ts
function parseDateForPrisma(dateStr) {
  const parsedDate = new Date(dateStr);
  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date format! Use YYYY-MM-DD or ISO string.");
  }
  const startOfDay = new Date(parsedDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(parsedDate);
  endOfDay.setHours(23, 59, 59, 999);
  return { gte: startOfDay, lte: endOfDay };
}

// src/app/modules/meal/meal.service.ts
var createMeal = async (data, email) => {
  if (!data.images) {
    throw new AppError_default(404, "Image is required");
  }
  const providerid = await prisma.user.findUnique({
    where: { email },
    include: { provider: { select: { id: true } } }
  });
  if (!providerid) {
    throw new AppError_default(status5.NOT_FOUND, "provider not found");
  }
  const categoryCheck = await prisma.category.findUnique({
    where: {
      name: data.category_name
    }
  });
  if (!categoryCheck) {
    throw new AppError_default(status5.NOT_FOUND, "category not found");
  }
  const result = await prisma.meal.create({
    data: {
      ...data,
      providerId: providerid.provider.id,
      deliverycharge: data.deliverycharge !== void 0 ? data.deliverycharge : 0
    }
  });
  return result;
};
var getAllmeals = async (data, isAvailable, page, limit, skip, sortBy, sortOrder, search) => {
  const andConditions = [];
  if (data) {
    const orConditions = [];
    if (search) {
      orConditions.push(
        {
          title: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          location: {
            contains: search,
            mode: "insensitive"
          }
        }
      );
    }
    if (data.cuisine) {
      orConditions.push({
        cuisine: {
          equals: data.cuisine
        }
      });
    }
    if (data.category_name) {
      orConditions.push({
        category_name: {
          contains: data.category_name,
          mode: "insensitive"
        }
      });
    }
    if (data?.date) {
      const dateRange = parseDateForPrisma(data.date);
      andConditions.push({ date: dateRange.gte });
    }
    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }
  if (typeof isAvailable === "boolean") {
    andConditions.push({ isAvailable });
  }
  if (data.price) {
    andConditions.push({
      price: {
        gte: 0,
        lte: Number(data.price)
      }
    });
  }
  if (data.dietaryPreference?.length) {
    const dietaryList = data.dietaryPreference.split(
      ","
    );
    andConditions.push({
      OR: dietaryList.map((item) => ({ dietaryPreference: item }))
    });
  }
  const meals = await prisma.meal.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
      status: "APPROVED"
    },
    include: {
      provider: {
        include: { user: true }
      },
      reviews: {
        where: {
          parentId: null,
          rating: { gt: 0 },
          status: "APPROVED"
        },
        include: {
          customer: true
        }
      }
    },
    orderBy: {
      [sortBy]: sortOrder
    }
  });
  const mealsWithStats = meals.map((meal) => {
    const totalReviews = meal.reviews.length;
    const avgRating = totalReviews > 0 ? meal.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
    return { ...meal, avgRating, totalReviews };
  });
  const total = await prisma.meal.count({ where: { AND: andConditions } });
  return {
    data: mealsWithStats,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / limit) || 1
    }
  };
};
var getMealByProvider = async () => {
  const meal = await prisma.meal.findFirst({
    where: {
      status: "APPROVED"
    },
    select: {
      deliverycharge: true
    }
  });
  return meal;
};
var getSinglemeals = async (id) => {
  const result = await prisma.meal.findUniqueOrThrow({
    where: {
      id,
      status: "APPROVED"
    },
    include: {
      category: true,
      provider: {
        include: {
          user: true,
          meals: {
            include: {
              reviews: {
                where: {
                  parentId: null,
                  status: "APPROVED",
                  rating: { gt: 0 }
                }
              }
            }
          }
        }
      },
      reviews: {
        where: {
          parentId: null,
          status: "APPROVED",
          rating: { gt: 0 }
        },
        include: {
          replies: {
            include: {
              customer: true,
              replies: true
            }
          },
          customer: {
            include: {
              reviews: true
            }
          }
        }
      }
    }
  });
  const mealTotalReviews = result.reviews.length;
  const mealAvgRating = mealTotalReviews > 0 ? Number(
    (result.reviews.reduce((sum, review) => sum + review.rating, 0) / mealTotalReviews).toFixed(1)
  ) : 0;
  const providerMeals = result.provider?.meals ?? [];
  let providerTotalReviews = 0;
  let providerRatingSum = 0;
  providerMeals.forEach((meal) => {
    const ratingReviews = meal.reviews.filter(
      (review) => typeof review.rating === "number"
    );
    providerTotalReviews += ratingReviews.length;
    providerRatingSum += ratingReviews.reduce((sum, r) => sum + r.rating, 0);
  });
  const providerAvgRating = providerTotalReviews > 0 ? Number((providerRatingSum / providerTotalReviews).toFixed(1)) : 0;
  console.log(result, "result");
  return {
    ...result,
    avgRating: mealAvgRating,
    totalReviews: mealTotalReviews,
    providerRating: {
      averageRating: providerAvgRating,
      totalReview: providerTotalReviews
    }
  };
};
var UpdateMeals = async (data, mealid) => {
  const { category_name } = data;
  const existmeal = await prisma.meal.findUnique({
    where: { id: mealid }
  });
  if (!existmeal) {
    throw new AppError_default(status5.NOT_FOUND, "meals not found");
  }
  if (existmeal.category_name === category_name) {
    throw new AppError_default(status5.CONFLICT, "category_name is already up to date.");
  }
  const result = await prisma.meal.update({
    where: {
      id: mealid
    },
    data: {
      title: data.title,
      description: data.description,
      ...data.images !== null && typeof data.images !== "undefined" ? { image: data.images } : {},
      price: data.price,
      isAvailable: data.isAvailable,
      category_name: data.category_name,
      cuisine: data.cuisine,
      dietaryPreference: data.dietaryPreference
    }
  });
  return result;
};
var DeleteMeals = async (mealid) => {
  const orderitem = await prisma.orderitem.findFirst({
    where: {
      mealId: mealid
    },
    select: {
      orderId: true
    }
  });
  await prisma.order.delete({ where: { id: orderitem?.orderId } });
  const result = await prisma.meal.delete({
    where: {
      id: mealid
    }
  });
  return result;
};
var getOwnMeals = async (email, data, isAvailable, page, limit, skip, sortBy, sortOrder, search) => {
  let userid;
  if (email) {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    if (!user) {
      throw new AppError_default(status5.NOT_FOUND, "User not found");
    }
    userid = user.id;
  }
  const andConditions = [];
  if (data) {
    const orConditions = [];
    if (search) {
      orConditions.push(
        {
          title: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: search,
            mode: "insensitive"
          }
        }
      );
    }
    if (data.cuisine) {
      orConditions.push({
        cuisine: {
          equals: data.cuisine
        }
      });
    }
    if (data.category_name) {
      orConditions.push({
        category_name: {
          contains: data.category_name,
          mode: "insensitive"
        }
      });
    }
    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }
  if (typeof isAvailable === "boolean") {
    andConditions.push({ isAvailable });
  }
  if (data?.price) {
    andConditions.push({
      price: {
        gte: 0,
        lte: Number(data.price)
      }
    });
  }
  if (data?.status) {
    andConditions.push({
      status: {
        equals: data.status
      }
    });
  }
  if (data?.dietaryPreference?.length) {
    const dietaryList = data.dietaryPreference.split(
      ","
    );
    andConditions.push({
      OR: dietaryList.map((item) => ({ dietaryPreference: item }))
    });
  }
  const meals = await prisma.meal.findMany({
    take: limit,
    skip,
    where: {
      provider: {
        userId: userid
      },
      AND: andConditions
    },
    include: {
      category: true,
      provider: true,
      reviews: {
        where: {
          parentId: null
        },
        include: {
          replies: {
            include: {
              replies: true
            }
          }
        }
      }
    }
  });
  const mealIds = meals.map((meal) => meal.id);
  const reviewData = await prisma.review.groupBy({
    by: ["mealId"],
    where: {
      mealId: { in: mealIds },
      parentId: null,
      rating: { gt: 0 },
      status: "APPROVED"
    },
    _avg: {
      rating: true
    },
    _count: {
      rating: true
    }
  });
  const mealsData = meals.map((meal) => {
    const stats = reviewData.find((s) => s.mealId === meal.id);
    return {
      ...meal,
      avgRating: stats?._avg?.rating || 0,
      // Default to 0
      totalReviews: stats?._count?.rating || 0
      // Default to 0
    };
  });
  const total = await prisma.meal.count({ where: {
    AND: andConditions,
    provider: {
      userId: userid
    }
  } });
  return {
    mealsData,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / (limit || 1)) || 1
    }
  };
};
var updateStatus = async (data, mealid) => {
  const { status: status29 } = data;
  const existmeal = await prisma.meal.findUnique({
    where: {
      id: mealid
    }
  });
  if (existmeal?.status === status29) {
    throw new AppError_default(409, "meal status already up to date");
  }
  if (existmeal?.id !== mealid) {
    throw new AppError_default(404, "mealid is invalid,please check your mealid");
  }
  const result = await prisma.meal.update({
    where: {
      id: mealid
    },
    data: {
      status: status29
    }
  });
  return result;
};
var getAllMealsForAdmin = async (data, isAvailable, page, limit, skip, sortBy, sortOrder, search) => {
  const andConditions = [];
  if (data) {
    const orConditions = [];
    if (search) {
      orConditions.push(
        {
          title: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: search,
            mode: "insensitive"
          }
        }
      );
    }
    if (data.cuisine) {
      orConditions.push({
        cuisine: {
          equals: data.cuisine
        }
      });
    }
    if (data.status) {
      orConditions.push({
        status: {
          equals: data.status
        }
      });
    }
    if (data.category_name) {
      orConditions.push({
        category_name: {
          contains: data.category_name,
          mode: "insensitive"
        }
      });
    }
    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }
  if (typeof isAvailable === "boolean") {
    andConditions.push({ isAvailable });
  }
  if (data.price) {
    andConditions.push({
      price: {
        gte: 0,
        lte: Number(data.price)
      }
    });
  }
  if (data.dietaryPreference?.length) {
    const dietaryList = data.dietaryPreference.split(
      ","
    );
    andConditions.push({
      OR: dietaryList.map((item) => ({ dietaryPreference: item }))
    });
  }
  const meals = await prisma.meal.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions
    },
    include: {
      provider: {
        include: { user: true }
      },
      reviews: {
        where: {
          parentId: null,
          rating: { gt: 0 },
          status: "APPROVED"
        },
        include: {
          customer: true
        }
      }
    },
    orderBy: {
      [sortBy]: sortOrder
    }
  });
  const total = await prisma.meal.count({ where: { AND: andConditions } });
  return {
    data: meals,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / limit) || 1
    }
  };
};
var mealService = {
  createMeal,
  UpdateMeals,
  DeleteMeals,
  getAllmeals,
  getSinglemeals,
  getOwnMeals,
  updateStatus,
  getAllMealsForAdmin,
  getMealByProvider
};

// src/app/helpers/paginationHelping.ts
var paginationSortingHelper = (options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 9;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};
var paginationHelping_default = paginationSortingHelper;

// src/app/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Something went wrong";
      res.status(statusCode).json({
        success: false,
        message,
        error: error.data
      });
    }
  };
};

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data
  });
};

// src/app/modules/meal/meal.controller.ts
import status6 from "http-status";
var createMeal2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const files = req.files;
  const payload = {
    ...req.body,
    images: files?.length ? files.map((file) => file.path) : req.body.images
  };
  console.log(payload, "payload");
  const result = await mealService.createMeal(payload, user.email);
  sendResponse(res, {
    httpStatusCode: status6.CREATED,
    success: true,
    message: "your meal has been created",
    data: result
  });
});
var UpdateMeals2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status6.UNAUTHORIZED).json({ success: false, message: "you are not authorized" });
  }
  const payload = {
    ...req.body,
    image: req.file?.path || req.body.image || null
  };
  const result = await mealService.UpdateMeals(
    payload,
    req.params.id
  );
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "meal update successfully",
    data: result
  });
});
var DeleteMeals2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status6.UNAUTHORIZED).json({
      success: false,
      message: "you are unauthorized"
    });
  }
  const result = await mealService.DeleteMeals(req.params.id);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "your meal delete has been successfully",
    data: result
  });
});
var Getallmeals = catchAsync(async (req, res) => {
  const { search } = req.query;
  const isAvailable = req.query.isAvailable ? req.query.isAvailable === "true" ? true : req.query.isAvailable == "false" ? false : void 0 : void 0;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(
    req.query
  );
  const result = await mealService.getAllmeals(
    req.query,
    isAvailable,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    search
  );
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: " retrieve all meals successfully",
    data: result
  });
});
var getAllMealsForAdmin2 = catchAsync(
  async (req, res) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(
      req.query
    );
    const { search } = req.query;
    const isAvailable = req.query.isAvailable ? req.query.isAvailable === "true" ? true : req.query.isAvailable == "false" ? false : void 0 : void 0;
    const result = await mealService.getAllMealsForAdmin(
      req.query,
      isAvailable,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
      search
    );
    sendResponse(res, {
      httpStatusCode: status6.OK,
      success: true,
      message: " retrieve all meals for admin successfully",
      data: result
    });
  }
);
var GetSignlemeals = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await mealService.getSinglemeals(id);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: " retrieve single meal successfully",
    data: result
  });
});
var getownmeals = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status6.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
  }
  const { search } = req.query;
  const isAvailable = req.query.isAvailable ? req.query.isAvailable === "true" ? true : req.query.isAvailable == "false" ? false : void 0 : void 0;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(
    req.query
  );
  const result = await mealService.getOwnMeals(
    user.email,
    req.query,
    isAvailable,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    search
  );
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "your own meal retrieve has been successfully",
    data: result
  });
});
var DeviceryCharge = catchAsync(async (req, res) => {
  const { providerId } = req.query;
  if (!providerId) {
    return res.status(status6.BAD_REQUEST).json({
      success: false,
      message: "providerId is required"
    });
  }
  const meal = await mealService.getMealByProvider();
  if (!meal) {
    return res.status(status6.NOT_FOUND).json({
      success: false,
      message: "No meal found for this provider"
    });
  }
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Delivery charge retrieved successfully",
    data: { deliveryCharge: meal.deliverycharge }
  });
});
var updateStatus2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status6.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
  }
  const { id } = req.params;
  const result = await mealService.updateStatus(req.body, id);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "meal status update successfully",
    data: result
  });
});
var mealController = {
  createMeal: createMeal2,
  UpdateMeals: UpdateMeals2,
  DeleteMeals: DeleteMeals2,
  Getallmeals,
  GetSignlemeals,
  getownmeals,
  updateStatus: updateStatus2,
  getAllMealsForAdmin: getAllMealsForAdmin2,
  DeviceryCharge
};

// src/app/utils/handleZodError.ts
var formatZodIssues = (error) => {
  return error.issues.map((e) => {
    let message = "";
    switch (e.code) {
      case "invalid_type":
        message = `field ${e.path.join(", ") || "unknown"} expected ${e.expected} type,but  received ${e.input},please provide a valid type`;
        break;
      case "unrecognized_keys":
        message = `You provided extra fields: ${e.keys || "unknown"}. Please remove keys ${e.keys}`;
        break;
      case "invalid_format":
        message = `field ${e.path.join(",") || "unknown"} is not a valid format(${e.format}) but received ${e.input},please prrovide a valid format`;
        break;
      case "invalid_value":
        message = `Invalid value. Allowed values are (${e.values}) but received ${e.input},plese provide a currect value`;
        break;
      case "too_big":
        message = `field  ${e.path} provide a big data,received ${e.input},please provide a valid value`;
        break;
      case "too_small":
        message = `field  ${e.path} provide a small data,received ${e.input},please provide a valid value`;
        break;
      default:
        message = `field ${e.path} is invalid data,received ${e.input}`;
    }
    return {
      message
    };
  });
};

// src/app/middleware/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    if (req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON in data field"
        });
      }
    }
    const parsedResult = zodSchema.safeParse(req.body);
    if (!parsedResult.success) {
      const zodmessage = formatZodIssues(parsedResult.error);
      return res.status(400).json({
        success: false,
        message: "your provided data is invalid",
        zodmessage
      });
    }
    req.body = parsedResult.data;
    next();
  };
};

// src/app/modules/meal/meal.validation.ts
import z from "zod";
var CreatemealData = z.object({
  title: z.string(),
  description: z.string().optional(),
  location: z.string().min(3, "Location is required"),
  images: z.array(z.string()).default([]),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  }).transform((val) => new Date(val).toISOString()),
  price: z.number(),
  deliverycharge: z.number().optional(),
  isAvailable: z.boolean().optional(),
  dietaryPreference: z.enum([
    "HALAL",
    "VEGAN",
    "VEGETARIAN",
    "ANY",
    "GLUTEN_FREE",
    "KETO",
    "PALEO",
    "DAIRY_FREE",
    "NUT_FREE",
    "LOW_SUGAR"
  ]).default("VEGETARIAN"),
  category_name: z.string(),
  cuisine: z.enum([
    "BANGLEDESHI",
    "ITALIAN",
    "CHINESE",
    "INDIAN",
    "MEXICAN",
    "THAI",
    "JAPANESE",
    "FRENCH",
    "MEDITERRANEAN",
    "AMERICAN",
    "MIDDLE_EASTERN"
  ]).default("BANGLEDESHI")
}).strict();
var UpdatemealData = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  date: z.any().optional(),
  location: z.string().optional(),
  images: z.any().optional(),
  price: z.number().optional(),
  isAvailable: z.boolean().optional(),
  category_name: z.string().optional(),
  cuisine: z.enum([
    "BANGLEDESHI",
    "ITALIAN",
    "CHINESE",
    "INDIAN",
    "MEXICAN",
    "THAI",
    "JAPANESE",
    "FRENCH",
    "MEDITERRANEAN",
    "AMERICAN",
    "MIDDLE_EASTERN"
  ]).optional(),
  dietaryPreference: z.enum([
    "HALAL",
    "VEGAN",
    "VEGETARIAN",
    "ANY",
    "GLUTEN_FREE",
    "KETO",
    "PALEO",
    "DAIRY_FREE",
    "NUT_FREE",
    "LOW_SUGAR"
  ]).optional()
});
var mealQuerySchema = z.object({
  data: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    price: z.coerce.number().optional(),
    // Coerce handles strings from forms/URLs
    dietaryPreference: z.string().optional(),
    cuisine: z.string().optional(),
    category_name: z.string().optional()
  })
});
var mealupdateStatus = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"])
});

// src/app/config/multer.config.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// src/app/config/cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
import status7 from "http-status";
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
  secure: true,
  timeout: 6e4
});
var cloudinaryUpload = cloudinary;

// src/app/config/multer.config.ts
var storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop()?.toLocaleLowerCase();
    const fileNameWithoutExtension = originalName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
    const folder = extension === "pdf" ? "pdfs" : "images";
    return {
      folder: `foodhub/${folder}`,
      public_id: uniqueName,
      resource_type: "auto",
      format: extension === "pdf" ? "pdf" : "webp",
      // ইমেজ হলে অটোমেটিক webp হবে (ফাইল সাইজ কমায়)
      transformation: extension !== "pdf" ? [{ quality: "auto", fetch_format: "auto" }] : void 0
    };
  }
});
var multerUpload = multer({ storage, limits: {
  fileSize: 1024 * 1024
} });

// src/app/modules/meal/meal.route.ts
var router = Router();
router.get("/meals", mealController.Getallmeals);
router.get("/deviveryCharge", mealController.DeviceryCharge);
router.get("/admin/meals", auth_default([UserRoles.Admin]), mealController.getAllMealsForAdmin);
router.get("/provider/meals/own", auth_default([UserRoles.Provider]), mealController.getownmeals);
router.post(
  "/provider/meal",
  auth_default([UserRoles.Provider]),
  multerUpload.array("files"),
  validateRequest(CreatemealData),
  mealController.createMeal
);
router.delete("/provider/meal/:id", auth_default([UserRoles.Provider, UserRoles.Admin]), mealController.DeleteMeals);
router.put("/provider/meal/:id", auth_default([UserRoles.Provider]), multerUpload.single("file"), validateRequest(UpdatemealData), mealController.UpdateMeals);
router.get("/meal/:id", mealController.GetSignlemeals);
router.patch("/meal/:id", auth_default([UserRoles.Admin]), mealController.updateStatus);
var mealRouter = { router };

// src/app/modules/provider/provider.route.ts
import { Router as Router2 } from "express";

// src/app/modules/provider/provider.service.ts
import status8 from "http-status";
var createProvider = async (data, userId) => {
  const existinguser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existinguser) {
    throw new AppError_default(404, "user not found");
  }
  const result = await prisma.providerProfile.create({
    data: {
      restaurantName: data.restaurantName,
      address: data.address,
      description: data.description,
      image: data.image,
      userId
    }
  });
  return result;
};
var getAllProvider = async (query, isActive, page, limit, skip, sortBy, sortOrder, search) => {
  const andConditions = [];
  if (search || query) {
    const orConditions = [];
    orConditions.push({
      restaurantName: {
        contains: search,
        mode: "insensitive"
      }
    });
    orConditions.push({
      address: {
        contains: search,
        mode: "insensitive"
      }
    });
    orConditions.push({
      description: {
        contains: search,
        mode: "insensitive"
      }
    });
    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }
  const providers = await prisma.providerProfile.findMany({
    where: {
      AND: andConditions,
      user: {
        name: {
          contains: search,
          mode: "insensitive"
        },
        isActive,
        email: query?.email
      }
    },
    take: limit,
    skip,
    include: {
      user: true,
      meals: {
        include: {
          reviews: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const result = providers.map((provider) => {
    const allReviews = provider.meals.flatMap((meal) => meal.reviews);
    const totalReviews = allReviews.length;
    const avgRating = totalReviews > 0 ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
    return {
      ...provider,
      totalReviews,
      avgRating
    };
  });
  return result;
};
var getProviderWithMeals = async (id) => {
  const existprovider = await prisma.providerProfile.findUnique({
    where: { id }
  });
  if (!existprovider) {
    throw new AppError_default(status8.NOT_FOUND, "provider not found for this id");
  }
  const provider = await prisma.providerProfile.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          reviews: true
        }
      },
      meals: {
        include: { category: true, reviews: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });
  if (!provider) {
    throw new AppError_default(status8.NOT_FOUND, "provider not found for this id");
  }
  const userid = provider.userId;
  const ratings = await prisma.review.groupBy({
    by: ["mealId"],
    where: {
      rating: {
        gt: 0
      },
      parentId: null,
      meal: {
        provider: {
          userId: userid
        }
      }
    },
    _avg: {
      rating: true
    },
    _count: {
      rating: true
    }
  });
  const totalReview = ratings.reduce((sum, r) => sum + r._count.rating, 0);
  const totalRating = ratings.reduce(
    (sum, r) => sum + (r._avg.rating ?? 0) * r._count.rating,
    0
  );
  const averageRating = totalReview > 0 ? totalRating / totalReview : 0;
  return {
    result: {
      ...provider,
      totalReviews: totalReview || 0,
      avgRating: Number(averageRating.toFixed(1)) || 0
    }
  };
};
var getTopProviders = async () => {
  const providers = await prisma.providerProfile.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true
        }
      },
      meals: {
        include: {
          reviews: {
            where: {
              parentId: null,
              status: "APPROVED"
            }
          }
        }
      }
    }
  });
  const topProviders = providers.map((provider) => {
    let totalRating = 0;
    let totalReviews = 0;
    provider.meals.forEach((meal) => {
      meal.reviews.filter((review) => review.parentId == null).forEach((review) => {
        if (typeof review.rating === "number") {
          totalRating += review.rating;
          totalReviews++;
        }
      });
    });
    const avgRating = totalReviews > 0 ? Number((totalRating / totalReviews).toFixed(1)) : 0;
    return {
      id: provider.id,
      restaurantName: provider.restaurantName,
      ownerName: provider.user?.name || "N/A",
      email: provider.user?.email || "N/A",
      address: provider.address,
      description: provider.description,
      image: provider.image || provider.user?.image || null,
      totalReviews,
      avgRating
    };
  }).sort((a, b) => {
    if (b.avgRating !== a.avgRating) {
      return b.avgRating - a.avgRating;
    }
    return b.totalReviews - a.totalReviews;
  }).slice(0, 15);
  return { topProviders };
};
var UpateProviderProfile = async (data, email) => {
  if (!data) {
    throw new AppError_default(status8.BAD_REQUEST, "no data provided for update");
  }
  const providerinfo = await prisma.user.findUnique({
    where: { email },
    include: {
      provider: true
    }
  });
  if (!providerinfo) {
    throw new AppError_default(status8.NOT_FOUND, "user not found");
  }
  const result = await prisma.providerProfile.update({
    where: { id: providerinfo.provider.id },
    data: {
      restaurantName: data.restaurantName,
      image: data.image,
      description: data.description,
      address: data.address
    }
  });
  return result;
};
var providerService = {
  createProvider,
  getAllProvider,
  getProviderWithMeals,
  UpateProviderProfile,
  getTopProviders
};

// src/app/modules/provider/provider.controller.ts
import status9 from "http-status";
var createProvider2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await providerService.createProvider(req.body, user.id);
    sendResponse(res, {
      httpStatusCode: status9.CREATED,
      success: true,
      message: "your provider profile has been created",
      data: result
    });
  }
);
var gelAllprovider = catchAsync(
  async (req, res) => {
    const { search } = req.query;
    const isActive = req.query.isActive ? req.query.isActive === "true" ? true : req.query.isActive == "false" ? false : void 0 : void 0;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
    const result = await providerService.getAllProvider(req.query, isActive, page, limit, skip, sortBy, sortOrder, search);
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "retrieve all provider successfully",
      data: result
    });
  }
);
var getProviderWithMeals2 = catchAsync(
  async (req, res) => {
    const result = await providerService.getProviderWithMeals(req.params.id);
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "retrieve provider with meals successfully",
      data: result
    });
  }
);
var UpateProviderProfile2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await providerService.UpateProviderProfile(req.body, user.email);
  if (!result) {
    sendResponse(res, {
      httpStatusCode: status9.BAD_REQUEST,
      success: false,
      message: "update provider profile failed",
      data: result
    });
  }
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "update provider profile successfully",
    data: result
  });
});
var getTopProviders2 = catchAsync(async (req, res) => {
  const result = await providerService.getTopProviders();
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "retrieve top providers successfully",
    data: result
  });
});
var providerController = { createProvider: createProvider2, gelAllprovider, getProviderWithMeals: getProviderWithMeals2, UpateProviderProfile: UpateProviderProfile2, getTopProviders: getTopProviders2 };

// src/app/modules/provider/provider.validation.ts
import z2 from "zod";
var CreateproviderData = z2.object({
  restaurantName: z2.string(),
  address: z2.string(),
  description: z2.string().optional(),
  image: z2.string().optional()
}).strict();
var UpdateproviderData = z2.object({
  restaurantName: z2.string().optional(),
  address: z2.string().optional(),
  description: z2.string().optional(),
  image: z2.string().min(8).optional()
}).strict();

// src/app/modules/provider/provider.route.ts
var router2 = Router2();
router2.post("/provider/profile", auth_default([UserRoles.Provider]), validateRequest(CreateproviderData), providerController.createProvider);
router2.put("/provider/update", auth_default([UserRoles.Provider]), validateRequest(UpdateproviderData), providerController.UpateProviderProfile);
router2.get("/providers", providerController.gelAllprovider);
router2.get("/providers/:id", providerController.getProviderWithMeals);
router2.get("/top-providers", providerController.getTopProviders);
var providerRouter = { router: router2 };

// src/app/modules/order/order.route.ts
import { Router as Router3 } from "express";

// src/app/modules/order/order.service.ts
import { v6 as uuidv6 } from "uuid";
import status10 from "http-status";

// src/app/config/stripe.config.ts
import Stripe from "stripe";
var stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY);

// src/app/modules/order/order.service.ts
var CreateOrder = async (payload, email) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (!existingUser) throw new AppError_default(404, "User not found");
  if (!payload.items?.length) {
    throw new AppError_default(400, "Order items are required");
  }
  const customerId = existingUser.id;
  const mealIds = payload.items.map((item) => item.mealId);
  const meals = await prisma.meal.findMany({
    where: { id: { in: mealIds } }
  });
  if (meals.length !== mealIds.length) {
    throw new AppError_default(404, "One or more meals were not found");
  }
  const mealById = new Map(meals.map((meal) => [meal.id, meal]));
  const providerIds = Array.from(new Set(meals.map((meal) => meal.providerId)));
  if (providerIds.length !== 1) {
    throw new AppError_default(
      400,
      "Single order supports meals from one provider only."
    );
  }
  const providerId = providerIds[0];
  const deliverycharge = Number(meals[0]?.deliverycharge ?? 0);
  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findMany({
        where: {
          paymentStatus: "UNPAID"
        }
      });
      if (existingOrder) {
        await prisma.order.deleteMany({
          where: {
            id: {
              in: existingOrder.map((item) => item.id)
            }
          }
        });
      }
      const existingActiveOrder = await tx.order.findMany({
        where: {
          customerId,
          providerId,
          status: { in: ["PLACED", "PREPARING", "READY"] },
          paymentStatus: "PAID"
        },
        include: {
          orderitem: { include: { meal: true } }
        }
      });
      const existingMealIds = existingActiveOrder.flatMap(
        (order2) => order2.orderitem.map((item) => item.mealId)
      );
      const matchedMealIds = existingMealIds.filter(
        (id) => mealIds.includes(id)
      );
      if (matchedMealIds.length > 0) {
        throw new AppError_default(
          409,
          `Already ordered meals: ${matchedMealIds.join(", ")}`
        );
      }
      const totalMealPrice = payload.items.reduce((sum, item) => {
        const meal = mealById.get(item.mealId);
        return sum + Number(meal?.price ?? 0) * item.quantity;
      }, 0);
      const order = await tx.order.create({
        data: {
          customerId,
          providerId,
          address: payload.address,
          phone: payload.phone,
          paymentStatus: deliverycharge > 0 ? "UNPAID" : "PAID",
          totalPrice: totalMealPrice,
          first_name: payload.first_name ?? null,
          last_name: payload.last_name ?? null,
          orderitem: {
            createMany: {
              data: payload.items.map((item) => {
                const meal = mealById.get(item.mealId);
                return {
                  mealId: item.mealId,
                  price: Number(meal?.price ?? 0),
                  quantity: item.quantity
                };
              })
            }
          }
        }
      });
      if (deliverycharge === 0) {
        return {
          order,
          payment: null,
          paymentUrl: null,
          message: "Order created successfully (no delivery charge)."
        };
      }
      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          amount: deliverycharge,
          transactionId: String(uuidv6()),
          status: "UNPAID",
          userId: customerId,
          mealId: payload.items[0].mealId
        }
      });
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "bdt",
              product_data: { name: "Delivery charge" },
              unit_amount: 120 * 100
            },
            quantity: 1
          }
        ],
        metadata: {
          orderId: order.id,
          paymentId: payment.id
        },
        payment_intent_data: {
          metadata: {
            orderId: order.id,
            paymentId: payment.id
          }
        },
        success_url: `${envVars.FRONTEND_URL}/payment/${order.id}?paymentId=${payment.id}`,
        cancel_url: `${envVars.FRONTEND_URL}/payment/${order.id}?paymentId=${payment.id}`
      });
      return {
        order,
        payment,
        paymentUrl: session.url,
        message: "Order created successfully. Please complete payment from checkout URL."
      };
    });
    return result;
  } catch (error) {
    console.error(error);
    if (error instanceof AppError_default) throw error;
    throw new AppError_default(500, "Failed to create order. Please try again.");
  }
};
var getOwnmealsOrder = async (email, data, page, limit, skip, sortBy, sortOrder, search) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: { provider: true }
  });
  if (!existingUser) {
    return {
      success: false,
      message: "User not found",
      result: null
    };
  }
  const andConditions = [];
  if (search) {
    const orConditions = [];
    orConditions.push(
      {
        first_name: {
          contains: search,
          mode: "insensitive"
        }
      },
      {
        last_name: {
          contains: search,
          mode: "insensitive"
        }
      }
    );
    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }
  if (data?.status) {
    andConditions.push({
      status: {
        equals: data.status
      }
    });
  }
  if (data?.phone) {
    andConditions.push({
      phone: data.phone
    });
  }
  if (data?.paymentStatus) {
    andConditions.push({
      paymentStatus: {
        equals: data.paymentStatus
      }
    });
  }
  if (data?.totalPrice) {
    andConditions.push({
      totalPrice: {
        gte: 0,
        lte: Number(data.totalPrice)
      }
    });
  }
  if (data?.createdAt) {
    const dateRange = parseDateForPrisma(data.createdAt);
    andConditions.push({ createdAt: dateRange.gte });
  }
  if (existingUser?.role == "Customer") {
    const result = await prisma.order.findMany({
      where: {
        customerId: existingUser.id,
        AND: andConditions
      },
      include: {
        orderitem: {
          include: {
            meal: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return {
      success: true,
      message: `your own meals orders retrieve successfully`,
      result
    };
  }
  if (existingUser?.role == "Provider") {
    const result = await prisma.order.findMany({
      take: limit,
      skip,
      where: {
        providerId: existingUser.provider?.id,
        AND: andConditions
      },
      include: {
        orderitem: {
          include: {
            meal: true
          }
        }
      }
    });
    let total = 0;
    if (existingUser?.role === "Provider") {
      total = await prisma.order.count({
        where: {
          providerId: existingUser.provider?.id,
          AND: andConditions
        }
      });
    } else if (existingUser?.role === "Customer") {
      total = await prisma.order.count({
        where: {
          customerId: existingUser.id,
          AND: andConditions
        }
      });
    }
    return {
      result,
      pagination: {
        total,
        page,
        limit,
        totalpage: Math.ceil(total / (limit || 1)) || 1
      }
    };
  }
};
var getOwnPaymentService = async (id, data, email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError_default(401, "User not found or unauthorized");
  }
  const orderres = await prisma.order.findUnique({
    where: {
      id
    },
    include: {
      payment: true
    }
  });
  if (orderres?.customerId !== user.id) {
    throw new AppError_default(403, "You are not authorized to view this order payment");
  }
  if (orderres?.paymentStatus == "UNPAID") {
    throw new AppError_default(400, "your payment is not paid");
  }
  if (!orderres?.payment || orderres.payment.id !== data.paymentId) {
    throw new AppError_default(404, "order payment not found");
  }
  if (!orderres) {
    throw new AppError_default(400, "Order not found for the provided ID or payment info");
  }
  return orderres;
};
var UpdateOrderStatus = async (id, data, role) => {
  const { status: status29 } = data;
  const statusValue = [
    "PLACED",
    "PREPARING",
    "READY",
    "DELIVERED",
    "CANCELLED"
  ];
  if (!statusValue.includes(status29)) {
    throw new AppError_default(400, "invalid status value");
  }
  const existingOrder = await prisma.order.findUnique({ where: { id } });
  if (!existingOrder) {
    throw new AppError_default(404, "no order found for this id");
  }
  if (existingOrder?.status == status29) {
    throw new AppError_default(409, `order already ${status29}`);
  }
  if (role == "Customer" && status29 !== "CANCELLED") {
    throw new AppError_default(400, "Customer can only change status to CANCELLED");
  }
  if (role == "Customer" && status29 == "CANCELLED") {
    if (existingOrder?.status == "DELIVERED" || existingOrder?.status == "PREPARING" || existingOrder?.status == "READY") {
      throw new AppError_default(
        400,
        `you can't cancel order when order status is ${existingOrder.status}`
      );
    }
    const result = await prisma.order.update({
      where: {
        id
      },
      data: {
        status: status29
      }
    });
    return result;
  }
  if (role == "Provider" && status29 === "CANCELLED") {
    throw new AppError_default(400, "CANCELLED only Customer Change");
  }
  if (role == "Provider") {
    if (status29 == "PLACED" || status29 == "PREPARING" || status29 == "READY" || status29 == "DELIVERED") {
      const result = await prisma.order.update({
        where: {
          id
        },
        data: {
          status: status29
        }
      });
      return {
        success: true,
        message: `update order status successfully`,
        result
      };
    }
  }
  if (role === "Admin") {
    const result = await prisma.order.update({
      where: {
        id
      },
      data: {
        status: status29
      }
    });
    return {
      success: true,
      message: `update order status successfully`,
      result
    };
  }
};
var getAllorder = async (role, data, page, limit, skip, sortBy, sortOrder, search) => {
  if (role !== "Admin") {
    throw new AppError_default(403, "View all orders is only allowed for Admin users.");
  }
  const andConditions = [];
  if (search) {
    const orConditions = [];
    orConditions.push(
      {
        first_name: {
          contains: search,
          mode: "insensitive"
        }
      },
      {
        last_name: {
          contains: search,
          mode: "insensitive"
        }
      }
    );
    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }
  if (data?.status) {
    andConditions.push({
      status: {
        equals: data.status
      }
    });
  }
  if (data?.phone) {
    andConditions.push({
      phone: data.phone
    });
  }
  if (data?.paymentStatus) {
    andConditions.push({
      paymentStatus: {
        equals: data.paymentStatus
      }
    });
  }
  if (data?.totalPrice) {
    andConditions.push({
      totalPrice: {
        gte: 0,
        lte: Number(data.totalPrice)
      }
    });
  }
  if (data?.createdAt) {
    const dateRange = parseDateForPrisma(data.createdAt);
    andConditions.push({ createdAt: dateRange.gte });
  }
  const result = await prisma.order.findMany({
    where: {
      AND: andConditions
    },
    include: {
      orderitem: {
        include: {
          meal: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const total = await prisma.order.count({
    where: {
      AND: andConditions
    }
  });
  return {
    result,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / (limit || 1)) || 1
    }
  };
};
var customerOrderStatusTrack = async (mealid, userid) => {
  const existingOrder = await prisma.order.findMany({
    where: {
      customerId: userid,
      orderitem: {
        some: {
          mealId: mealid
        }
      }
    }
  });
  if (existingOrder.length === 0) {
    throw new AppError_default(status10.NOT_FOUND, "no order found for this meal");
  }
  return {
    success: true,
    message: `customer order status track successfully`,
    result: existingOrder
  };
};
var CustomerRunningAndOldOrder = async (userid, status29) => {
  const andConditions = [];
  let message = "customer running and old order retrieve successfully";
  let currentStatus = status29;
  if (status29 == "DELIVERED") {
    andConditions.push({ status: status29 });
    message = "Recent order information retrieved successfully.", currentStatus = status29;
  }
  if (status29 == "CANCELLED") {
    andConditions.push({ status: status29 });
    message = "CANCELLED order information retrieved successfully.", currentStatus = status29;
  }
  if (status29 == "PLACED" || status29 == "PREPARING" || status29 == "READY") {
    andConditions.push({ status: status29 });
    message = "running order retrieved successfully.", currentStatus = status29;
  }
  const result = await prisma.order.findMany({
    where: {
      customerId: userid,
      AND: andConditions
    },
    include: {
      orderitem: { orderBy: { createdAt: "desc" } }
    }
  });
  return {
    success: true,
    message,
    result
  };
};
var getSingleOrder = async (id) => {
  const result = await prisma.order.findUnique({
    where: { id },
    include: {
      orderitem: {
        select: {
          meal: true,
          orderId: true,
          price: true,
          quantity: true
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });
  if (!result) {
    throw new AppError_default(status10.NOT_FOUND, "no order found for this id");
  }
  return {
    success: true,
    message: `single order retrieve successfully`,
    result
  };
};
var deleteOrder = async (id, role) => {
  const existingOrder = await prisma.order.findUnique({
    where: { id }
  });
  if (!existingOrder) {
    throw new AppError_default(status10.NOT_FOUND, "Order not found");
  }
  const deletedOrder = await prisma.order.delete({
    where: { id }
  });
  return {
    success: true,
    message: "Order deleted successfully",
    result: deletedOrder
  };
};
var ServiceOrder = {
  CreateOrder,
  getOwnmealsOrder,
  UpdateOrderStatus,
  getAllorder,
  customerOrderStatusTrack,
  CustomerRunningAndOldOrder,
  getSingleOrder,
  getOwnPaymentService,
  deleteOrder
};

// src/app/modules/order/order.controller.ts
import status11 from "http-status";
var createOrder = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(status11.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const result = await ServiceOrder.CreateOrder(req.body, user.email);
    sendResponse(res, {
      httpStatusCode: status11.CREATED,
      success: true,
      message: "your order has been created successfully",
      data: result
    });
  }
);
var getOwnmealsOrder2 = catchAsync(async (req, res) => {
  const user = req.user;
  const { search } = req.query;
  if (!user) {
    return res.status(status11.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
  }
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
  const result = await ServiceOrder.getOwnmealsOrder(user.email, req.query, page, limit, skip, sortBy, sortOrder, search);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "your own meals orders retrieve successfully",
    data: result
  });
});
var UpdateOrderStatus2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(status11.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const result = await ServiceOrder.UpdateOrderStatus(req.params.id, req.body, user.role);
    sendResponse(res, {
      httpStatusCode: status11.OK,
      success: true,
      message: "update order status successfully",
      data: result
    });
  }
);
var getAllOrder = catchAsync(
  async (req, res) => {
    const user = req.user;
    const { search } = req.query;
    if (!user) {
      return res.status(status11.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
    const result = await ServiceOrder.getAllorder(user.role, req.query, page, limit, skip, sortBy, sortOrder, search);
    if (!result) {
      sendResponse(res, {
        httpStatusCode: status11.BAD_REQUEST,
        success: false,
        message: "retrieve all orders failed",
        data: result
      });
    }
    sendResponse(res, {
      httpStatusCode: status11.OK,
      success: true,
      message: "retrieve all orders successfully",
      data: result
    });
  }
);
var customerOrderStatusTrack2 = catchAsync(
  async (req, res) => {
    const users = req.user;
    if (!users) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(
      req.query
    );
    const { search } = req.query;
    const result = await ServiceOrder.customerOrderStatusTrack(req.params.id, users.id);
    if (!result?.success) {
      sendResponse(res, {
        httpStatusCode: status11.BAD_REQUEST,
        success: false,
        message: result?.message,
        data: result?.result
      });
    }
    sendResponse(res, {
      httpStatusCode: status11.OK,
      success: true,
      message: "customer order status track successfully",
      data: result?.result
    });
  }
);
var CustomerRunningAndOldOrder2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(status11.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const result = await ServiceOrder.CustomerRunningAndOldOrder(user.id, req.query.status);
    if (!result.success) {
      sendResponse(res, {
        httpStatusCode: status11.BAD_REQUEST,
        success: false,
        message: "customer order status track failed",
        data: result?.result
      });
    }
    sendResponse(res, {
      httpStatusCode: status11.OK,
      success: true,
      message: result.message,
      data: result?.result
    });
  }
);
var getSingleOrder2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await ServiceOrder.getSingleOrder(req.params.id);
  if (!result.success) {
    sendResponse(res, {
      httpStatusCode: status11.BAD_REQUEST,
      success: false,
      message: "retrieve single order failed",
      data: result
    });
  }
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "retrieve single order successfully",
    data: result?.result
  });
});
var getOwnPayment = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await ServiceOrder.getOwnPaymentService(req.params.id, req.query, user?.email);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Fetched own payment order successfully",
    data: result
  });
});
var deleteOrder2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const orderId = req.params.id;
  try {
    const result = await ServiceOrder.deleteOrder(orderId, user.role);
    sendResponse(res, {
      httpStatusCode: status11.OK,
      success: true,
      message: "Order deleted successfully",
      data: result
    });
  } catch (error) {
    sendResponse(res, {
      httpStatusCode: error.statusCode || status11.BAD_REQUEST,
      success: false,
      message: error.message || "Failed to delete order",
      data: error
    });
  }
});
var OrderController = {
  createOrder,
  getOwnmealsOrder: getOwnmealsOrder2,
  UpdateOrderStatus: UpdateOrderStatus2,
  getAllOrder,
  customerOrderStatusTrack: customerOrderStatusTrack2,
  CustomerRunningAndOldOrder: CustomerRunningAndOldOrder2,
  getSingleOrder: getSingleOrder2,
  getOwnPayment,
  deleteOrder: deleteOrder2
};

// src/app/modules/order/order.validation.ts
import z3 from "zod";
var CreateorderData = z3.object({
  first_name: z3.string().optional(),
  last_name: z3.string().optional(),
  phone: z3.string().min(11).max(14),
  address: z3.string().min(1),
  items: z3.array(
    z3.object({
      mealId: z3.string(),
      quantity: z3.number().min(1)
    })
  ).min(1)
});

// src/app/modules/order/order.route.ts
var router3 = Router3();
router3.post("/orders", auth_default([UserRoles.Customer]), validateRequest(CreateorderData), OrderController.createOrder);
router3.get("/orders/meal/:id/status", auth_default([UserRoles.Customer]), OrderController.customerOrderStatusTrack);
router3.get("/myorders/status", auth_default([UserRoles.Customer]), OrderController.CustomerRunningAndOldOrder);
router3.get("/orders/all", auth_default([UserRoles.Admin]), OrderController.getAllOrder);
router3.get("/orders", auth_default([UserRoles.Customer, UserRoles.Provider]), OrderController.getOwnmealsOrder);
router3.patch("/provider/orders/:id", auth_default([UserRoles.Provider, UserRoles.Customer, UserRoles.Admin]), OrderController.UpdateOrderStatus);
router3.get("/orders/:id", auth_default([UserRoles.Customer]), OrderController.getSingleOrder);
router3.delete("/order/:id", auth_default([UserRoles.Admin]), OrderController.deleteOrder);
router3.get("/order/:id/own-payment", auth_default([UserRoles.Customer]), OrderController.getOwnPayment);
var OrderRouter = { router: router3 };

// src/app/modules/category/category.route.ts
import { Router as Router4 } from "express";

// src/app/modules/category/category.service.ts
import status12 from "http-status";
var CreateCategory = async (data, email) => {
  if (!data.image) {
    throw new AppError_default(404, "Image is required");
  }
  const adminUser = await prisma.user.findUnique({
    where: { email }
  });
  if (!adminUser) {
    throw new AppError_default(status12.UNAUTHORIZED, "Admin user not found or unauthorized");
  }
  const adminId = adminUser.id;
  const categorydata = await prisma.category.findUnique({
    where: {
      name: data.name
    }
  });
  if (categorydata) {
    throw new AppError_default(409, "Category already exists");
  }
  await prisma.user.findUniqueOrThrow({
    where: { id: adminId }
  });
  const result = await prisma.category.create({
    data: {
      ...data,
      adminId
    }
  });
  return result;
};
var getCategory = async (data, page, limit, skip) => {
  const andConditions = [];
  if (data?.name) {
    andConditions.push({
      name: data.name
    });
  }
  if (data?.createdAt) {
    const dateRange = parseDateForPrisma(data.createdAt);
    andConditions.push({ createdAt: dateRange.gte });
  }
  if (data?.adminId) {
    andConditions.push({
      adminId: {
        contains: data.adminId,
        mode: "insensitive"
      }
    });
  }
  if (data?.id) {
    andConditions.push({
      id: {
        contains: data.id,
        mode: "insensitive"
      }
    });
  }
  const result = await prisma.category.findMany({
    where: {
      AND: andConditions
    },
    include: {
      meals: {
        where: {
          status: "APPROVED"
        }
      },
      user: true
    },
    orderBy: { name: "desc" }
  });
  const total = await prisma.category.count({ where: {
    AND: andConditions
  } });
  return {
    result,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / limit) || 1
    }
  };
};
var SingleCategory = async (id) => {
  const result = await prisma.category.findFirstOrThrow({
    where: { id },
    include: {
      meals: {
        include: {
          reviews: true,
          provider: { include: { user: true } }
        }
      },
      user: true
    }
  });
  if (result && Array.isArray(result.meals)) {
    result.meals = result.meals.map((meal) => {
      let totalRating = 0;
      let totalReviews = 0;
      if (Array.isArray(meal.reviews)) {
        meal.reviews = meal.reviews.filter(
          (review) => review.status === "APPROVED" && review.parentId === null || typeof review.status === "undefined"
        );
        meal.reviews.forEach((review) => {
          if ((review.status === "APPROVED" || typeof review.status === "undefined") && typeof review.rating === "number") {
            totalRating += review.rating;
            totalReviews++;
          }
        });
      }
      const avgRating = totalReviews > 0 ? Number((totalRating / totalReviews).toFixed(1)) : 0;
      return {
        ...meal,
        avgRating,
        totalReviews
      };
    });
  }
  return result;
};
var UpdateCategory = async (id, data) => {
  const { name } = data;
  const existcategory = await prisma.category.findUniqueOrThrow({
    where: { id }
  });
  if (existcategory.name == name) {
    throw new AppError_default(409, "Category name is already up to date.");
  }
  const result = await prisma.category.update({
    where: {
      id
    },
    data: {
      ...data
    }
  });
  return result;
};
var DeleteCategory = async (id) => {
  await prisma.category.findUniqueOrThrow({ where: { id } });
  const result = await prisma.category.delete({
    where: { id }
  });
  return result;
};
var categoryService = {
  CreateCategory,
  getCategory,
  UpdateCategory,
  DeleteCategory,
  SingleCategory
};

// src/app/modules/category/category.controller.ts
import { status as status13 } from "http-status";
var CreateCategory2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(status13.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const payload = {
      ...req.body,
      image: req.file?.path || req.body.image
    };
    console.log(payload, "payloadi");
    const result = await categoryService.CreateCategory(
      payload,
      user.email
    );
    sendResponse(res, {
      httpStatusCode: status13.CREATED,
      success: true,
      message: "your category has been created",
      data: result
    });
  }
);
var getCategory2 = catchAsync(async (req, res) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(
    req.query
  );
  const result = await categoryService.getCategory(req.query, page, limit, skip);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "retrieve category successfully",
    data: result
  });
});
var SingleCategory2 = catchAsync(async (req, res) => {
  const result = await categoryService.SingleCategory(req.params.id);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "retrieve single category successfully",
    data: result
  });
});
var UpdateCategory2 = catchAsync(async (req, res) => {
  const result = await categoryService.UpdateCategory(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "your category has beed changed",
    data: result
  });
});
var DeleteCategory2 = catchAsync(async (req, res) => {
  const result = await categoryService.DeleteCategory(req.params.id);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "your category has beed deleted",
    data: result
  });
});
var CategoryController = {
  CreateCategory: CreateCategory2,
  getCategory: getCategory2,
  UpdateCategory: UpdateCategory2,
  DeleteCategory: DeleteCategory2,
  SingleCategory: SingleCategory2
};

// src/app/modules/category/category.validation.ts
import z4 from "zod";
var createcategoryData = z4.object({
  name: z4.string(),
  image: z4.any()
}).strict();
var UpdatecategoryData = z4.object({
  name: z4.string().optional(),
  image: z4.any().optional()
}).strict();

// src/app/modules/category/category.route.ts
var router4 = Router4();
router4.post("/admin/category", auth_default([UserRoles.Admin]), multerUpload.single("file"), validateRequest(createcategoryData), CategoryController.CreateCategory);
router4.get("/category", CategoryController.getCategory);
router4.get("/category/:id", CategoryController.SingleCategory);
router4.put("/admin/category/:id", auth_default([UserRoles.Admin]), multerUpload.single("file"), validateRequest(UpdatecategoryData), CategoryController.UpdateCategory);
router4.delete("/admin/category/:id", auth_default([UserRoles.Admin]), CategoryController.DeleteCategory);
var CategoryRouter = { router: router4 };

// src/app/modules/user/user.route.ts
import { Router as Router5 } from "express";

// src/app/modules/user/user.service.ts
import status14 from "http-status";
var GetAllUsers = async (data, isactivequery, emailVerifiedquery, page, limit, skip, sortBy, sortOrder, search) => {
  const andCondition = [];
  if (typeof data.email == "string") {
    andCondition.push({
      email: data.email
    });
  }
  if (typeof isactivequery === "boolean") {
    andCondition.push({ isActive: isactivequery });
  }
  if (typeof data.name == "string") {
    andCondition.push({
      name: data.name
    });
  }
  if (typeof data.phone == "string") {
    andCondition.push({
      email: data.phone
    });
  }
  if (typeof emailVerifiedquery == "boolean") {
    andCondition.push({ emailVerified: emailVerifiedquery });
  }
  if (typeof data.role == "string") {
    andCondition.push({ role: data.role });
  }
  if (typeof data.status == "string") {
    andCondition.push({ status: data.status });
  }
  const result = await prisma.user.findMany({
    take: limit,
    skip,
    where: {
      AND: andCondition,
      ...data.data?.isActive !== null ? { isActive: data.data?.isActive } : {}
    },
    include: {
      provider: true,
      accounts: true
    },
    orderBy: {
      [data.sortBy]: data.sortOrder
    }
  });
  const total = await prisma.user.count({
    where: {
      AND: andCondition,
      ...data.data?.isActive !== null ? { isActive: data.data?.isActive } : {}
    }
  });
  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / limit) || 1
    }
  };
};
var getUserprofile = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id }
  });
  if (!user) {
    throw new AppError_default(status14.NOT_FOUND, "user not found for this id");
  }
  if (user.role !== "Provider") {
    return user;
  }
  const providerProfile = await prisma.providerProfile.findUnique({
    where: {
      userId: id
    },
    include: {
      user: {
        include: {
          reviews: {
            where: {
              rating: {
                gt: 0
              },
              parentId: null
            }
          }
        }
      }
    }
  });
  const totalReview = providerProfile?.user.reviews.length;
  const averageRating = totalReview ? providerProfile.user.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReview : 0;
  return {
    ...user,
    providerProfile,
    totalReview: totalReview || 0,
    averageRating: Number(averageRating.toFixed(1)) || 0
  };
};
var UpateUserProfile = async (data, email) => {
  if (!data) {
    throw new AppError_default(400, "your data isn't found,please provide a information");
  }
  const userinfo = await prisma.user.findUnique({
    where: { email },
    include: {
      accounts: true
    }
  });
  if (!userinfo) {
    throw new AppError_default(404, "user data not found");
  }
  const isCustomer = userinfo.role == "Customer";
  const result = await prisma.user.update({
    where: { email },
    data: {
      name: data.name,
      image: data.image,
      bgimage: data.bgimage,
      phone: data.phone,
      isActive: data.isActive,
      ...isCustomer ? {} : { email: data.email },
      accounts: {
        updateMany: {
          where: { userId: userinfo.id },
          data: {
            password: data.password
          }
        }
      }
    }
  });
  return result;
};
var UpdateUser = async (id, data) => {
  const userData = await prisma.user.findUnique({ where: { id } });
  if (!userData) {
    throw new AppError_default(404, "your user data didn't found");
  }
  if (userData.role == data.role) {
    throw new AppError_default(409, `your status(${data.role}) already up to date`);
  }
  const result = await prisma.user.update({
    where: {
      id
    },
    data: {
      role: data.role,
      status: data.status,
      email: data.email
    }
  });
  return result;
};
var DeleteUserProfile = async (id) => {
  const userData = await prisma.user.findUnique({ where: { id } });
  if (!userData) {
    throw new AppError_default(404, "your user data didn't found");
  }
  const result = await prisma.user.delete({
    where: { id }
  });
  return result;
};
var OwnProfileDelete = async (userid) => {
  const userData = await prisma.user.findUnique({
    where: { id: userid }
  });
  if (!userData) {
    throw new AppError_default(404, "your user data not found");
  }
  const result = await prisma.user.delete({
    where: { id: userid }
  });
  return result;
};
var UserService = {
  GetAllUsers,
  UpdateUser,
  getUserprofile,
  UpateUserProfile,
  DeleteUserProfile,
  OwnProfileDelete
};

// src/app/modules/user/user.controller.ts
import status15 from "http-status";
var GetAllUsers2 = catchAsync(async (req, res) => {
  const { search } = req.query;
  const { isActive } = req.query;
  const isactivequery = isActive ? req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : void 0 : void 0;
  const emailVerifiedquery = req.query.emailVerified ? req.query.emailVerified === "true" ? true : req.query.emailVerified === "false" ? false : void 0 : void 0;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(
    req.query
  );
  const result = await UserService.GetAllUsers(
    req.query,
    isactivequery,
    emailVerifiedquery,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    search
  );
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "retrieve all users has been successfully",
    data: result
  });
});
var getUserprofile2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status15.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
  }
  const result = await UserService.getUserprofile(req.params.id);
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: user.role !== "Provider" ? "your user profile has been retrieved successfully" : "your user profile has been retrieved successfully",
    data: result
  });
});
var UpateUserProfile2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const payload = {
    ...req.body,
    image: req.file?.path || req.body.image
  };
  const result = await UserService.UpateUserProfile(
    payload,
    user.email
  );
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "your profile has been updated successfully",
    data: result
  });
});
var UpdateUser2 = catchAsync(
  async (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await UserService.UpdateUser(
      req.params.id,
      req.body
    );
    sendResponse(res, {
      httpStatusCode: status15.OK,
      success: true,
      message: `user change successfully`,
      data: result
    });
  }
);
var DeleteUserProfile2 = catchAsync(
  async (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await UserService.DeleteUserProfile(req.params.id);
    sendResponse(res, {
      httpStatusCode: status15.OK,
      success: true,
      message: "user account delete successfully",
      data: result
    });
  }
);
var OwnProfileDelete2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await UserService.OwnProfileDelete(user.id);
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "user own account delete successfully",
    data: result
  });
});
var UserController = {
  GetAllUsers: GetAllUsers2,
  UpdateUser: UpdateUser2,
  getUserprofile: getUserprofile2,
  UpateUserProfile: UpateUserProfile2,
  DeleteUserProfile: DeleteUserProfile2,
  OwnProfileDelete: OwnProfileDelete2
};

// src/app/modules/user/user.validation.ts
import z5 from "zod";
var UpdateuserProfileData = z5.object({
  name: z5.string().optional(),
  image: z5.any().optional(),
  bgimage: z5.string().optional(),
  email: z5.string().optional(),
  password: z5.string().min(8).optional(),
  phone: z5.string().min(10).max(15).optional(),
  isActive: z5.boolean().optional()
}).strict();
var UpdateUserCommonData = z5.object({
  role: z5.enum(["Admin", "Customer", "Provider"]).optional(),
  status: z5.enum(["activate", "suspend"]).optional(),
  email: z5.string().optional()
}).strict();

// src/app/modules/user/user.route.ts
var router5 = Router5();
router5.get("/admin/users", auth_default([UserRoles.Admin]), UserController.GetAllUsers);
router5.put("/user/profile/update", auth_default([UserRoles.Customer, UserRoles.Provider, UserRoles.Admin]), validateRequest(UpdateuserProfileData), UserController.UpateUserProfile);
router5.get("/user/profile/:id", auth_default([UserRoles.Customer, UserRoles.Admin, UserRoles.Provider]), UserController.getUserprofile);
router5.put("/admin/profile/:id", auth_default([UserRoles.Admin]), validateRequest(UpdateUserCommonData), UserController.UpdateUser);
router5.delete("/user/profile/own", auth_default([UserRoles.Provider, UserRoles.Customer, UserRoles.Admin]), UserController.OwnProfileDelete);
router5.delete("/user/profile/:id", auth_default([UserRoles.Admin]), UserController.DeleteUserProfile);
var UserRouter = { router: router5 };

// src/app/modules/reviews/reviews.route.ts
import { Router as Router6 } from "express";

// src/app/modules/reviews/reviews.service.ts
var CreateReviews = async (customerid, mealid, data) => {
  const existingmeal = await prisma.meal.findUnique({
    where: {
      id: mealid
    }
  });
  if (!existingmeal) {
    throw new AppError_default(404, "meal not found for this id");
  }
  const orderMeal = await prisma.orderitem.findFirst({
    where: {
      mealId: mealid,
      order: {
        customerId: customerid
      }
    }
  });
  if (!orderMeal) {
    throw new AppError_default(404, "you can not review for this meal without order");
  }
  if (data.rating >= 6) {
    throw new AppError_default(400, "rating must be between 1 and 5");
  }
  const result = await prisma.review.create({
    data: {
      customerId: customerid,
      mealId: mealid,
      ...data
    }
  });
  return result;
};
var updateReview = async (reviewId, data, authorId) => {
  const review = await prisma.review.findFirst({
    where: {
      id: reviewId,
      customerId: authorId
    },
    select: {
      id: true
    }
  });
  if (!review) {
    throw new AppError_default(404, "your review not found,please update your own review");
  }
  const result = await prisma.review.update({
    where: {
      id: reviewId,
      customerId: authorId
    },
    data: {
      ...data
    }
  });
  return {
    success: true,
    message: `your review update successfully`,
    result
  };
};
var deleteReview = async (reviewid, authorid) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewid
    },
    select: {
      id: true
    }
  });
  if (!review) {
    throw new AppError_default(404, "review not found");
  }
  const result = await prisma.review.delete({
    where: {
      id: review.id
    }
  });
  return result;
};
var getReviewByid = async (reviewid) => {
  const result = await prisma.review.findUnique({
    where: {
      id: reviewid
    },
    include: {
      meal: true
    }
  });
  if (!result) {
    throw new AppError_default(404, "review not found");
  }
  return result;
};
var moderateReview = async (id, data) => {
  const { status: status29 } = data;
  const reviewData = await prisma.review.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      status: true
    }
  });
  if (!reviewData) {
    throw new AppError_default(404, "review data not found by id");
  }
  if (reviewData.status === data.status) {
    throw new AppError_default(409, `Your provided status (${data.status}) is already up to date.`);
  }
  const result = await prisma.review.update({
    where: {
      id
    },
    data: {
      status: status29
    }
  });
  return result;
};
var getAllreviews = async (data, page, limit, skip, sortBy, sortOrder, search) => {
  const andConditions = [];
  if (search) {
    const orConditions = [];
    orConditions.push(
      {
        comment: {
          contains: search,
          mode: "insensitive"
        }
      }
    );
    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }
  if (data?.createdAt) {
    const dateRange = parseDateForPrisma(data.createdAt);
    andConditions.push({ createdAt: dateRange.gte });
  }
  if (data?.rating) {
    andConditions.push({
      rating: {
        equals: data.rating
      }
    });
  }
  if (data?.parentId) {
    andConditions.push({
      parentId: {
        equals: data.parentId
      }
    });
  }
  if (data?.status) {
    andConditions.push({
      status: {
        equals: data.status
      }
    });
  }
  const result = await prisma.review.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions
    },
    include: {
      customer: true,
      meal: true,
      replies: true
    }
  });
  const total = await prisma.review.count({ where: {
    AND: andConditions
  } });
  return {
    result,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / limit) || 1
    }
  };
  return result;
};
var ReviewsService = { CreateReviews, updateReview, deleteReview, getReviewByid, moderateReview, getAllreviews };

// src/app/modules/reviews/reviews.controller.ts
import status16 from "http-status";
var CreateReviews2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await ReviewsService.CreateReviews(user.id, req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status16.CREATED,
    success: true,
    message: "your review has been created successfully",
    data: result
  });
});
var updateReview2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const { reviewid } = req.params;
  const result = await ReviewsService.updateReview(reviewid, req.body, user?.id);
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "review update successfully",
    data: result
  });
});
var deleteReview2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const { reviewid } = req.params;
    const result = await ReviewsService.deleteReview(reviewid, user?.id);
    sendResponse(res, {
      httpStatusCode: status16.OK,
      success: true,
      message: "review delete successfully",
      data: result
    });
  }
);
var moderateReview2 = catchAsync(async (req, res) => {
  const { reviewid } = req.params;
  const result = await ReviewsService.moderateReview(reviewid, req.body);
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "review moderate successfully",
    data: result
  });
});
var getReviewByid2 = catchAsync(
  async (req, res) => {
    const { reviewid } = req.params;
    const result = await ReviewsService.getReviewByid(reviewid);
    sendResponse(res, {
      httpStatusCode: status16.OK,
      success: true,
      message: "retrieve review by id successfully",
      data: result
    });
  }
);
var getAllreviews2 = catchAsync(
  async (req, res) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(
      req.query
    );
    const { search } = req.query;
    const result = await ReviewsService.getAllreviews(req.query, page, limit, skip, sortBy, sortOrder, search);
    sendResponse(res, {
      httpStatusCode: status16.OK,
      success: true,
      message: "retrieve all reviews successfully",
      data: result
    });
  }
);
var ReviewsController = { CreateReviews: CreateReviews2, updateReview: updateReview2, deleteReview: deleteReview2, getReviewByid: getReviewByid2, moderateReview: moderateReview2, getAllreviews: getAllreviews2 };

// src/app/modules/reviews/reviews.validation.ts
import z6 from "zod";
var createReviewsData = z6.object({
  rating: z6.number().min(1).max(5),
  comment: z6.string(),
  parentId: z6.string().optional()
});
var updateReviewsData = z6.object({
  rating: z6.number().min(1).max(5).optional(),
  comment: z6.string().optional()
});
var moderateData = z6.object({
  status: z6.enum(["APPROVED", "REJECTED"])
});

// src/app/modules/reviews/reviews.route.ts
var router6 = Router6();
router6.post("/meal/:id/review", auth_default([UserRoles.Customer]), validateRequest(createReviewsData), ReviewsController.CreateReviews);
router6.put("/review/:reviewid", auth_default([UserRoles.Customer]), validateRequest(updateReviewsData), ReviewsController.updateReview);
router6.delete("/review/:reviewid", auth_default([UserRoles.Customer, UserRoles.Admin]), ReviewsController.deleteReview);
router6.get("/reviews", ReviewsController.getAllreviews);
router6.get("/review/:reviewid", ReviewsController.getReviewByid);
router6.patch("/review/:reviewid/moderate", auth_default([UserRoles.Admin]), validateRequest(moderateData), ReviewsController.moderateReview);
var ReviewsRouter = { router: router6 };

// src/app/modules/auth/auth.route.ts
import { Router as Router7 } from "express";

// src/app/utils/token.ts
var getAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
  );
  return accessToken;
};
var getRefreshToken = (payload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );
  return refreshToken;
};
var setAccessTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var setRefreshTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //7d
    maxAge: 60 * 60 * 24 * 1e3 * 7
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  CookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/app/modules/auth/auth.service.ts
import status17 from "http-status";
var getCurrentUser = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { provider: true }
  });
  if (!user) {
    throw new AppError_default(status17.NOT_FOUND, "User not found");
  }
  return user;
};
var signoutUser = async (sessionToken) => {
  await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return {
    success: true,
    message: `current user signout successfully`
  };
};
var signup = async (data) => {
  const {
    name,
    email,
    password,
    image,
    phone,
    role,
    restaurantName,
    address,
    description
  } = data;
  const userExist = await prisma.user.findUnique({
    where: { email }
  });
  if (!image) {
    throw new AppError_default(
      status17.BAD_REQUEST,
      "Image is required to register a user."
    );
  }
  if (userExist) {
    throw new AppError_default(status17.CONFLICT, "Email already in use");
  }
  const result = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      image,
      phone,
      role
    }
  });
  if (data.role === "Provider") {
    await prisma.providerProfile.create({
      data: {
        userId: result.user.id,
        restaurantName,
        address,
        description
      }
    });
  }
  await auth.api.signInEmail({
    body: {
      email: data.email,
      password: data.password
    }
  });
  return {
    ...result.user,
    token: result.token
  };
};
var signin = async (data) => {
  const existingUesr = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  });
  if (!existingUesr) {
    throw new AppError_default(404, "user not found");
  }
  const result = await auth.api.signInEmail({
    body: {
      email: data.email,
      password: data.password
    }
  });
  if (result.user.status === "suspend") {
    throw new AppError_default(status17.UNAUTHORIZED, "User is suspend");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: result.user.id,
    role: result.user.role,
    name: result.user.name,
    email: result.user.email,
    status: result.user.status,
    emailVerified: result.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: result.user.id,
    role: result.user.role,
    name: result.user.name,
    email: result.user.email,
    status: result.user.status,
    emailVerified: result.user.emailVerified
  });
  return {
    ...result,
    accessToken,
    refreshToken
  };
};
var getNewToken = async (refreshToken, sessionToken) => {
  const isSessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken
    },
    include: {
      user: true
    }
  });
  if (!isSessionTokenExists) {
    throw new AppError_default(status17.UNAUTHORIZED, "Invalid session token");
  }
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError_default(status17.UNAUTHORIZED, "Invalid refresh token");
  }
  const data = verifiedRefreshToken.data;
  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    emailVerified: data.emailVerified
  });
  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    emailVerified: data.emailVerified
  });
  const { token } = await prisma.session.update({
    where: {
      token: sessionToken
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1e3),
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token
  };
};
var verifyEmail = async (email, otp) => {
  const data = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp
    }
  });
  if (data.status && !data.user.emailVerified) {
    await prisma.user.update({
      where: {
        email
      },
      data: {
        emailVerified: true
      }
    });
  }
};
var sendOtp = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    throw new AppError_default(status17.NOT_FOUND, "User not found");
  }
  if (user.status === "suspend") {
    throw new AppError_default(status17.NOT_FOUND, "your are suspend");
  }
  if (user.emailVerified) {
    throw new AppError_default(status17.BAD_REQUEST, "Email already verified");
  }
  const result = await auth.api.sendVerificationOTP({
    body: {
      email,
      // required
      type: "email-verification"
    }
  });
  return result;
};
var forgetPassword = async (email) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError_default(status17.NOT_FOUND, "User not found");
  }
  if (isUserExist.status == "suspend") {
    throw new AppError_default(status17.NOT_FOUND, "your account is suspend");
  }
  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email
    }
  });
};
var resetPassword = async (email, otp, newPassword) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError_default(status17.NOT_FOUND, "User not found");
  }
  if (isUserExist.status == "suspend") {
    throw new AppError_default(status17.NOT_FOUND, "your account is suspend");
  }
  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword
    }
  });
  await prisma.session.deleteMany({
    where: {
      userId: isUserExist.id
    }
  });
};
var changePassword = async (payload, sessionToken) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!session) {
    throw new AppError_default(status17.UNAUTHORIZED, "Invalid session token");
  }
  const { currentPassword, newPassword } = payload;
  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!result) {
    throw new AppError_default(400, "user change password failed");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    emailVerified: session.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    emailVerified: session.user.emailVerified
  });
  return {
    ...result,
    accessToken,
    refreshToken
  };
};
var authService = {
  getCurrentUser,
  signoutUser,
  signup,
  signin,
  getNewToken,
  verifyEmail,
  sendOtp,
  forgetPassword,
  resetPassword,
  changePassword
};

// src/app/modules/auth/auth.controller.ts
import status18 from "http-status";
var getCurrentUser2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await authService.getCurrentUser(user.email);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "retrieve current user successsfully",
    data: result
  });
});
var signoutUser2 = catchAsync(async (req, res) => {
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await authService.signoutUser(betterAuthSessionToken);
  CookieUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  CookieUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  CookieUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "User logged out successfully",
    data: result
  });
});
var signup2 = catchAsync(async (req, res) => {
  const payload = {
    ...req.body,
    image: req.file?.path || req.body.image
  };
  const result = await authService.signup(payload);
  if (!result) {
    return res.status(400).json({ success: false, message: "Signup failed" });
  }
  sendResponse(res, {
    httpStatusCode: status18.CREATED,
    success: true,
    message: "user signup successfully",
    data: result
  });
});
var signin2 = catchAsync(async (req, res) => {
  const result = await authService.signin(req.body);
  const { accessToken, refreshToken, token } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "user signin successfully",
    data: result
  });
});
var getNewToken2 = catchAsync(
  async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    if (!refreshToken) {
      throw new AppError_default(status18.UNAUTHORIZED, "Refresh token is missing");
    }
    const result = await authService.getNewToken(refreshToken, betterAuthSessionToken);
    const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
    sendResponse(res, {
      httpStatusCode: status18.OK,
      success: true,
      message: "New tokens generated successfully",
      data: {
        accessToken,
        refreshToken: newRefreshToken,
        sessionToken
      }
    });
  }
);
var verifyEmail2 = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  await authService.verifyEmail(email, otp);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Email verified successfully"
  });
});
var sendOtp2 = catchAsync(async (req, res) => {
  const { email } = req.body;
  await authService.sendOtp(email);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "OTP sent to email successfully"
  });
});
var forgetPassword2 = catchAsync(async (req, res) => {
  const { email } = req.body;
  await authService.forgetPassword(email);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Password reset OTP sent to email successfully"
  });
});
var resetPassword2 = catchAsync(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  await authService.resetPassword(email, otp, newPassword);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Password reset successfully"
  });
});
var changePassword2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await authService.changePassword(
    payload,
    betterAuthSessionToken
  );
  const { accessToken, refreshToken, token } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Password changed successfully",
    data: result
  });
});
var authController = {
  getCurrentUser: getCurrentUser2,
  signoutUser: signoutUser2,
  signup: signup2,
  signin: signin2,
  getNewToken: getNewToken2,
  verifyEmail: verifyEmail2,
  sendOtp: sendOtp2,
  forgetPassword: forgetPassword2,
  resetPassword: resetPassword2,
  changePassword: changePassword2
};

// src/app/modules/auth/auth.validation.ts
import z7 from "zod";
var createUserSchema = z7.object({
  name: z7.string(),
  email: z7.string().email(),
  password: z7.string().min(6),
  image: z7.any(),
  phone: z7.string(),
  role: z7.string(),
  restaurantName: z7.string(),
  address: z7.string(),
  description: z7.string()
});
var updateValidation = z7.object({
  name: z7.string().optional(),
  email: z7.string().email().optional(),
  password: z7.string().min(6).optional(),
  image: z7.any().optional(),
  bgimage: z7.string().optional(),
  phone: z7.string().optional(),
  role: z7.string().optional(),
  restaurantName: z7.string().optional(),
  address: z7.string().optional(),
  description: z7.string().optional()
});

// src/app/modules/auth/auth.route.ts
var router7 = Router7();
router7.get("/me", auth_default([UserRoles.Admin, UserRoles.Customer, UserRoles.Provider]), authController.getCurrentUser);
router7.post("/logout", auth_default([UserRoles.Admin, UserRoles.Customer, UserRoles.Provider]), authController.signoutUser);
router7.post("/register", multerUpload.single("file"), validateRequest(createUserSchema), authController.signup);
router7.post("/login", authController.signin);
router7.post("/change-password", auth_default([UserRoles.Admin, UserRoles.Provider, UserRoles.Customer]), authController.changePassword);
router7.post("/refresh-token", authController.getNewToken);
router7.post("/verify-email", authController.verifyEmail);
router7.post("/send-otp", authController.sendOtp);
router7.post("/forget-password", authController.forgetPassword);
router7.post("/reset-password", authController.resetPassword);
var authRouter = { router: router7 };

// src/app/modules/stats/stats.route.ts
import express from "express";

// src/app/modules/stats/stats.controller.ts
import status20 from "http-status";

// src/app/modules/stats/stats.service.ts
import status19 from "http-status";
var getDashboardStatsData = async (user) => {
  const userExists = await prisma.user.findUnique({
    where: { email: user.email }
  });
  if (!userExists) {
    throw new AppError_default(status19.NOT_FOUND, "User does not exist");
  }
  let statsData;
  switch (user.role) {
    case UserRoles.Admin:
      statsData = getAdminDashboardStats();
      break;
    case UserRoles.Provider:
      statsData = getProviderDashboardStats(userExists.id);
      break;
    default:
      throw new AppError_default(status19.BAD_REQUEST, "Invalid user role");
  }
  return statsData;
};
var getAdminDashboardStats = async () => {
  try {
    const counts = await prisma.$transaction([
      prisma.meal.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.review.count(),
      prisma.payment.count()
    ]);
    const [mealsCount, userCount, orderCount, reviewCount, paymentCount] = counts;
    const [approvedmeals, pendingmeals, rejectedmeals] = await Promise.all([
      prisma.meal.count({ where: { status: "APPROVED" } }),
      prisma.meal.count({ where: { status: "PENDING" } }),
      prisma.meal.count({ where: { status: "REJECTED" } })
    ]);
    const [cancelledorder, deliveredorder, placedorder, preparingorder, readyorder] = await Promise.all([
      prisma.order.count({ where: { status: "CANCELLED" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.count({ where: { status: "PLACED" } }),
      prisma.order.count({ where: { status: "PREPARING" } }),
      prisma.order.count({ where: { status: "READY" } })
    ]);
    const revenueResult = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: PaymentStatus.PAID }
    });
    const totalRevenue = revenueResult._sum.amount ?? 0;
    const payments = await prisma.payment.findMany({
      where: { status: PaymentStatus.PAID },
      select: { amount: true, createdAt: true }
    });
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyRevenue = {};
    payments.forEach((payment) => {
      const month = payment.createdAt.getMonth();
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(payment.amount);
    });
    const barChartData = monthNames.map((month, idx) => ({
      month,
      revenue: monthlyRevenue[idx] ?? 0
    }));
    return {
      counts: {
        mealsCount,
        orderCount,
        reviewCount,
        userCount,
        paymentCount
      },
      totalRevenue,
      monthlyRevenue: barChartData,
      order: {
        cancelledorder,
        deliveredorder,
        placedorder,
        preparingorder,
        readyorder
      },
      mealStatus: {
        approvedmeals,
        pendingmeals,
        rejectedmeals
      }
      // pieChartData,
    };
  } catch (error) {
    console.error("Failed to fetch admin dashboard stats:", error);
    throw new Error("Could not fetch dashboard stats");
  }
};
var getProviderDashboardStats = async (userId) => {
  try {
    const provider = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });
    if (!provider) {
      throw new Error("Provider not found");
    }
    const counts = await prisma.$transaction([
      prisma.meal.count({
        where: { provider: { userId } }
      }),
      prisma.order.count({
        where: { provider: { userId } }
      })
    ]);
    const [mealsCount, orderCount] = counts;
    const [approvedmeals, pendingmeals, rejectedmeals] = await Promise.all([
      prisma.meal.count({ where: { provider: { userId }, status: "APPROVED" } }),
      prisma.meal.count({ where: { provider: { userId }, status: "PENDING" } }),
      prisma.meal.count({ where: { provider: { userId }, status: "REJECTED" } })
    ]);
    const [cancelledorder, deliveredorder, placedorder, preparingorder, readyorder] = await Promise.all([
      prisma.order.count({ where: { provider: { userId }, status: "CANCELLED" } }),
      prisma.order.count({ where: { provider: { userId }, status: "DELIVERED" } }),
      prisma.order.count({ where: { provider: { userId }, status: "PLACED" } }),
      prisma.order.count({ where: { provider: { userId }, status: "PREPARING" } }),
      prisma.order.count({ where: { provider: { userId }, status: "READY" } })
    ]);
    const providerOrders = await prisma.order.findMany({
      where: {
        provider: { userId }
      },
      select: { id: true }
    });
    const orderIds = providerOrders.map((order) => order.id);
    let totalRevenue = 0;
    let barChartData = [];
    if (orderIds.length > 0) {
      const revenueResult = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          orderId: { in: orderIds },
          status: PaymentStatus.PAID
        }
      });
      totalRevenue = revenueResult._sum.amount ?? 0;
      const payments = await prisma.payment.findMany({
        where: {
          orderId: { in: orderIds },
          status: PaymentStatus.PAID
        },
        select: { amount: true, createdAt: true }
      });
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyRevenue = {};
      payments.forEach((payment) => {
        const month = payment.createdAt.getMonth();
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(payment.amount);
      });
      barChartData = monthNames.map((month, idx) => ({
        month,
        revenue: monthlyRevenue[idx] ?? 0
      }));
    } else {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      barChartData = monthNames.map((month) => ({ month, revenue: 0 }));
    }
    return {
      counts: {
        mealsCount,
        orderCount
      },
      totalRevenue,
      monthlyRevenue: barChartData,
      mealStatus: {
        approvedmeals,
        pendingmeals,
        rejectedmeals
      },
      order: {
        cancelledorder,
        deliveredorder,
        placedorder,
        preparingorder,
        readyorder
      }
    };
  } catch (error) {
    console.error("Failed to fetch provider dashboard stats:", error);
    throw new Error("Could not fetch provider dashboard stats");
  }
};
var getPublicStatsData = async () => {
  try {
    const totalmeals = await prisma.meal.count();
    const totalUsers = await prisma.user.count();
    const totalCustomer = await prisma.user.count({
      where: { role: "Customer" }
    });
    const totalprovider = await prisma.user.count({
      where: { role: "Provider" }
    });
    const totalAdmins = await prisma.user.count({
      where: { role: "Admin" }
    });
    const totalorders = await prisma.order.count();
    const totalcategory = await prisma.category.count();
    const totalReviews = await prisma.review?.count?.({ where: { status: "APPROVED", parentId: null } }) ?? 0;
    const totalNewsletters = await prisma.newsletter?.count?.() ?? 0;
    return {
      totalmeals,
      totalUsers,
      totalCustomer,
      totalprovider,
      totalAdmins,
      totalorders,
      totalcategory,
      totalReviews,
      totalNewsletters
    };
  } catch (error) {
    console.error("Failed to fetch public stats:", error);
    throw new Error("Could not fetch public stats");
  }
};
var statsService = { getDashboardStatsData, getPublicStatsData };

// src/app/modules/stats/stats.controller.ts
var getDashboardStatsData2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status20.UNAUTHORIZED).json({
      success: false,
      message: "you are unauthorized"
    });
  }
  const result = await statsService.getDashboardStatsData(user);
  sendResponse(res, {
    httpStatusCode: status20.OK,
    success: true,
    message: "Stats data retrieved successfully!",
    data: result
  });
});
var getPublicStatsData2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await statsService.getPublicStatsData();
  sendResponse(res, {
    httpStatusCode: status20.OK,
    success: true,
    message: "Stats data retrieved successfully!",
    data: result
  });
});
var StatsController = {
  getDashboardStatsData: getDashboardStatsData2,
  getPublicStatsData: getPublicStatsData2
};

// src/app/modules/stats/stats.route.ts
var router8 = express.Router();
router8.get(
  "/stats",
  auth_default([UserRoles.Admin, UserRoles.Provider]),
  StatsController.getDashboardStatsData
);
router8.get(
  "/publicstats",
  StatsController.getPublicStatsData
);
var StatsRoutes = router8;

// src/app/modules/payment/payment.route.ts
import { Router as Router8 } from "express";

// src/app/modules/payment/payment.controller.ts
import status21 from "http-status";

// src/app/modules/payment/payment.service.ts
var deleteParticipantAndPayment = async (participantId, paymentId) => {
  if (!participantId || !paymentId) {
    console.error("Missing participantId or paymentId in session metadata");
    return;
  }
  await prisma.$transaction(async (tx) => {
    await tx.payment.deleteMany({
      where: { id: paymentId }
    });
    await tx.order.deleteMany({
      where: { id: participantId }
    });
  });
  console.log(
    `Payment failed. Deleted participant ${participantId} and payment ${paymentId}`
  );
};
var cleanupAllUnpaidPayments = async () => {
  const unpaidPayments = await prisma.payment.findMany({
    where: { status: PaymentStatus.UNPAID },
    select: { id: true, orderId: true }
  });
  if (!unpaidPayments.length) {
    return { deletedPayments: 0, deletedParticipants: 0 };
  }
  const paymentIds = unpaidPayments.map((p) => p.id);
  const orderIds = unpaidPayments.map((p) => p.orderId);
  const [deletedPayments, deletedParticipants] = await prisma.$transaction([
    prisma.payment.deleteMany({
      where: { id: { in: paymentIds } }
    }),
    prisma.order.deleteMany({
      where: { id: { in: orderIds } }
    })
  ]);
  return {
    deletedPayments: deletedPayments.count,
    deletedParticipants: deletedParticipants.count
  };
};
var handlerStripeWebhookEvent = async (event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id
    }
  });
  if (existingPayment) {
    console.log(`Event ${event.id} already processed. Skipping`);
    return { message: `Event ${event.id} already processed. Skipping` };
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const paymentId = session.metadata?.paymentId;
      if (!orderId || !paymentId) {
        console.error("Missing appointmentId or paymentId in session metadata");
        return {
          message: "Missing appointmentId or paymentId in session metadata"
        };
      }
      const order = await prisma.order.findUnique({
        where: {
          id: orderId
        }
      });
      if (!order) {
        console.error(`order with id ${orderId} not found`);
        return { message: `order with id ${orderId} not found` };
      }
      if (session.payment_status !== "paid") {
        await deleteParticipantAndPayment(orderId, paymentId);
        await cleanupAllUnpaidPayments();
        break;
      }
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: {
            id: orderId
          },
          data: {
            paymentStatus: PaymentStatus.PAID
          }
        });
        await tx.payment.update({
          where: {
            id: paymentId
          },
          data: {
            stripeEventId: event.id,
            status: PaymentStatus.PAID,
            paymentGatewayData: session
          }
        });
      });
      console.log(
        `Processed checkout.session.completed for order ${orderId} and payment ${paymentId}`
      );
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const paymentId = session.metadata?.paymentId;
      await deleteParticipantAndPayment(orderId, paymentId);
      await cleanupAllUnpaidPayments();
      break;
    }
    case "payment_intent.succeeded": {
      const session = event.data.object;
      console.log(
        `Payment intent ${session.id} succeeded.`
      );
      break;
    }
    case "payment_intent.payment_failed": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const paymentId = session.metadata?.paymentId;
      await deleteParticipantAndPayment(orderId, paymentId);
      await cleanupAllUnpaidPayments();
      break;
    }
    case "checkout.session.async_payment_failed": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const paymentId = session.metadata?.paymentId;
      await deleteParticipantAndPayment(orderId, paymentId);
      await cleanupAllUnpaidPayments();
      break;
    }
    case "payment_intent.canceled": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const paymentId = session.metadata?.paymentId;
      await deleteParticipantAndPayment(orderId, paymentId);
      await cleanupAllUnpaidPayments();
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return { message: `Webhook Event ${event.id} processed successfully` };
};
var getAllPaymentsService = async (email, page, limit, skip, sortBy, sortOrder, query) => {
  await cleanupAllUnpaidPayments();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");
  if (user.role !== "Admin") {
    throw new Error("Unauthorized: Only admin can access all payments");
  }
  const filters = [];
  if (query.status) filters.push({ status: query.status });
  if (query.amount) filters.push({ amount: Number(query.amount) });
  if (query.paymentStatus) filters.push({ status: query.paymentStatus });
  if (query.createdAt) {
    const dateRange = parseDateForPrisma(query.createdAt);
    filters.push({ createdAt: dateRange });
  }
  if (query.userId) filters.push({ userId: query.userId });
  if (query.eventId) filters.push({ eventId: query.eventId });
  const whereOptions = filters.length ? { AND: filters } : {};
  ;
  const payments = await prisma.payment.findMany({
    where: whereOptions,
    skip,
    take: limit,
    orderBy: { "createdAt": "desc" },
    include: {
      meal: true,
      order: true,
      user: true
    }
  });
  const total = await prisma.payment.count({ where: whereOptions });
  return {
    payments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var updatePaymentStatusWithOrderCheck = async (paymentId, newStatus) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { meal: true }
  });
  if (!payment) {
    throw new AppError_default(404, "Payment not found");
  }
  if (!payment.meal) {
    throw new AppError_default(404, "Associated meal not found");
  }
  if (newStatus.toUpperCase() === PaymentStatus.UNPAID) {
    const [deletedPayment, deletedParticipant] = await prisma.$transaction([
      prisma.payment.delete({
        where: { id: paymentId }
      }),
      prisma.order.delete({
        where: { id: payment.orderId }
      })
    ]);
    return {
      payment: deletedPayment,
      participant: deletedParticipant,
      message: "Payment is UNPAID, so payment and order were deleted"
    };
  }
  const [updatedPayment, updatedOrder] = await prisma.$transaction([
    prisma.payment.update({
      where: { id: paymentId },
      data: { status: newStatus }
    }),
    prisma.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: newStatus }
    })
  ]);
  return {
    payment: updatedPayment,
    order: updatedOrder
  };
};
var deletePayment = async (paymentId) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { order: true }
  });
  if (!payment) {
    throw new Error("Payment not found");
  }
  if (!payment.order) {
    throw new Error("Associated participant not found");
  }
  const [deletedPayment, deletedOrder] = await prisma.$transaction([
    prisma.payment.delete({
      where: { id: paymentId }
    }),
    prisma.order.delete({
      where: { id: payment.order.id }
    })
  ]);
  return {
    payment: deletedPayment,
    order: deletedOrder
  };
};
var PaymentService = {
  handlerStripeWebhookEvent,
  getAllPaymentsService,
  updatePaymentStatusWithOrderCheck,
  deletePayment
};

// src/app/modules/payment/payment.controller.ts
var handleStripeWebhookEvent = catchAsync(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET;
  fetch("http://127.0.0.1:7268/ingest/0e44685c-8c68-4e88-86ca-8c289d1bed8b", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "20e4f1"
    },
    body: JSON.stringify({
      sessionId: "20e4f1",
      runId: "pre-fix",
      location: "payment.controller.ts:entry",
      message: "Webhook request received",
      data: {
        hasSignature: Boolean(signature),
        bodyIsBuffer: Buffer.isBuffer(req.body),
        contentType: req.headers["content-type"],
        webhookSecretPrefix: webhookSecret?.slice(0, 10)
      },
      hypothesisId: "H2_H3_H4",
      timestamp: Date.now()
    })
  }).catch(() => {
  });
  if (!signature || !webhookSecret) {
    console.error("Missing Stripe signature or webhook secret");
    return res.status(status21.BAD_REQUEST).json({ message: "Missing Stripe signature or webhook secret" });
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error("Error processing Stripe webhook:", error);
    fetch("http://127.0.0.1:7268/ingest/0e44685c-8c68-4e88-86ca-8c289d1bed8b", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "20e4f1"
      },
      body: JSON.stringify({
        sessionId: "20e4f1",
        runId: "pre-fix",
        location: "payment.controller.ts:constructEvent:catch",
        message: "Stripe webhook signature failed",
        data: {
          errMsg: error instanceof Error ? error.message : String(error),
          bodyIsBuffer: Buffer.isBuffer(req.body)
        },
        hypothesisId: "H1",
        timestamp: Date.now()
      })
    }).catch(() => {
    });
    return res.status(status21.BAD_REQUEST).json({ message: "Error processing Stripe webhook" });
  }
  try {
    const result = await PaymentService.handlerStripeWebhookEvent(event);
    sendResponse(res, {
      httpStatusCode: status21.OK,
      success: true,
      message: "Stripe webhook event processed successfully",
      data: result
    });
  } catch (error) {
    console.error("Error handling Stripe webhook event:", error);
    sendResponse(res, {
      httpStatusCode: status21.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Error handling Stripe webhook event"
    });
  }
});
var getAllPayment = catchAsync(async (req, res) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
  const payments = await PaymentService.getAllPaymentsService(req.user?.email, page, limit, skip, sortBy, sortOrder, req.query);
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "All payment fetched",
    data: payments
  });
});
var updatePaymentStatus = catchAsync(async (req, res) => {
  const { paymentId } = req.params;
  const { status: newStatus } = req.body;
  try {
    const result = await PaymentService.updatePaymentStatusWithOrderCheck(paymentId, newStatus);
    return sendResponse(res, {
      httpStatusCode: status21.OK,
      success: true,
      message: "Payment status updated successfully",
      data: result
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return sendResponse(res, {
      httpStatusCode: status21.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Error updating payment status"
    });
  }
});
var deletePayment2 = catchAsync(async (req, res) => {
  const { paymentId } = req.params;
  try {
    const result = await PaymentService.deletePayment(paymentId);
    return sendResponse(res, {
      httpStatusCode: status21.OK,
      success: true,
      message: "Payment deleted successfully",
      data: result
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    return sendResponse(res, {
      httpStatusCode: status21.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Error deleting payment"
    });
  }
});
var PaymentController = {
  handleStripeWebhookEvent,
  getAllPayment,
  updatePaymentStatus,
  deletePayment: deletePayment2
};

// src/app/modules/payment/payment.route.ts
var router9 = Router8();
router9.get("/payments", auth_default([UserRoles.Admin]), PaymentController.getAllPayment);
router9.patch(
  "/payments/:paymentId/status",
  auth_default([UserRoles.Admin]),
  PaymentController.updatePaymentStatus
);
router9.delete(
  "/payments/:paymentId",
  auth_default([UserRoles.Admin]),
  PaymentController.deletePayment
);
var PaymentRouter = router9;

// src/app/modules/rag/rag.route.ts
import { Router as Router9 } from "express";

// src/app/modules/rag/embedding.service.ts
var EmbeddingService = class {
  apikey;
  apiUrl = "https://openrouter.ai/api/v1";
  embeddingModel;
  constructor() {
    this.apikey = envVars.RAG.OPENROUTER_API_KEY;
    this.embeddingModel = envVars.RAG.OPENROUTER_EMBEDDING_MODEL;
    if (!this.apikey) {
      throw new Error("OPENROUTER_API_KEY is not set in .env");
    }
  }
  async generateEmbedding(text) {
    try {
      const response = await fetch(`${this.apiUrl}/embeddings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apikey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input: text,
          model: this.embeddingModel
        })
      });
      if (!response.ok) {
        throw new Error(`OpenRouter API Error: ${response.status}`);
      }
      const data = await response.json();
      if (!data.data || data.data.length == 0) {
        throw new Error("No embedding data returned");
      }
      return data.data[0].embedding;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};

// src/app/modules/rag/Indexing.service.ts
var toVectorLiteral = (vector) => `[${vector.join(",")}]`;
var IndexingService = class {
  embeddingService;
  constructor() {
    this.embeddingService = new EmbeddingService();
  }
  async indexDocument(chunkKey, sourceType, sourceId, content, sourceLabel, metadata) {
    try {
      const embedding = await this.embeddingService.generateEmbedding(content);
      const vectorLiteral = toVectorLiteral(embedding);
      await prisma.$executeRaw(prismaNamespace_exports.sql`
        INSERT INTO "document_embeddings"
        (
          "id",
          "chunkKey",
          "sourceType",
          "sourceId",
          "sourceLabel",
          "content",
          "metadata",
          "embedding",
          "updatedAt"
        )
        VALUES
        (
          ${prismaNamespace_exports.raw("gen_random_uuid()")},
          ${chunkKey},
          ${sourceType},
          ${sourceId},
          ${sourceLabel || null},
          ${content},
          ${JSON.stringify(metadata || {})}::jsonb,
          CAST(${vectorLiteral} AS vector),
          NOW()
        )
        ON CONFLICT ("chunkKey")
        DO UPDATE SET
          "sourceType" = EXCLUDED."sourceType",
          "sourceId" = EXCLUDED."sourceId",
          "sourceLabel" = EXCLUDED."sourceLabel",
          "content" = EXCLUDED."content",
          "metadata" = EXCLUDED."metadata",
          "embedding" = EXCLUDED."embedding",
          "isDeleted" = false,
          "deletedAt" = null,
          "updatedAt" = NOW()
      `);
    } catch (error) {
      console.error("\u274C Index document error:", error);
      throw error;
    }
  }
  async indexMealsData() {
    try {
      console.log("Fetching meals for indexing...");
      const meals = await prisma.meal.findMany({
        include: {
          blogs: true,
          orderitem: {
            include: {
              order: true
            }
          },
          category: true,
          provider: {
            include: { user: true }
          },
          reviews: {
            where: {
              parentId: null,
              rating: { gt: 0 },
              status: "APPROVED"
            },
            include: {
              customer: true
            }
          }
        }
      });
      let indexedCount = 0;
      for (const meal of meals) {
        const orders = meal.orderitem.map((oi) => oi.order);
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => {
          return sum + (order.totalPrice || 0);
        }, 0);
        const totalReviews = meal.reviews.length;
        const avgRating = totalReviews > 0 ? meal.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
        const reviewsText = meal.reviews.map(
          (r) => `
Rating: ${r.rating}/5
Comment: ${r.comment || "No comment"}
Customer: ${r.customer?.name || "Anonymous"}
`
        ).join("\n");
        const blogsText = meal.blogs.map(
          (b) => `
Title: ${b.title}
Content: ${b.content}
Published: ${b.createdAt}
`
        ).join("\n");
        const content = `

ID: ${meal.id}
Title: ${meal.title}
Description: ${meal.description || "No description"}

Category: ${meal.category_name}
Cuisine: ${meal.cuisine}
Dietary: ${meal.dietaryPreference}

Location: ${meal.location}
Date: ${meal.date}

Price: ${meal.price} BDT
Delivery Charge: ${meal.deliverycharge} BDT
Availability: ${meal.isAvailable ? "Available" : "Not Available"}
Status: ${meal.status}

Name: ${meal.provider?.user?.name || "Unknown"}
Email: ${meal.provider?.user?.email || "Unknown"}


Total Orders: ${totalOrders}
Total Revenue: ${totalRevenue} BDT

Total Reviews: ${totalReviews}
Average Rating: ${avgRating.toFixed(2)} / 5

Performance Level:
${totalRevenue > 1e4 ? "High Earning Meal" : totalRevenue > 5e3 ? "Moderate Performance" : "Low Performance"}

===== REVIEWS =====
${reviewsText || "No reviews"}

===== BLOGS =====
${blogsText || "No blogs"}
`;
        const metadata = {
          mealId: meal.id,
          title: meal.title,
          category: meal.category_name,
          cuisine: meal.cuisine,
          location: meal.location,
          price: meal.price,
          isAvailable: meal.isAvailable,
          totalOrders,
          totalRevenue,
          totalReviews,
          avgRating,
          providerId: meal.providerId,
          providerRole: meal.provider?.user?.role || "USER",
          createdAt: meal.createdAt
        };
        const chunkKey = `meal-${meal.id}`;
        await this.indexDocument(
          chunkKey,
          "MEAL",
          meal.id,
          content,
          meal.title,
          metadata
        );
        indexedCount++;
      }
      console.log(`Indexed ${indexedCount} meals successfully`);
      return {
        success: true,
        indexedCount
      };
    } catch (error) {
      console.error(" Indexing failed:", error);
      throw error;
    }
  }
};

// src/app/modules/rag/llm.service.ts
var LLMService = class {
  apiKey;
  apiUrl = "https://openrouter.ai/api/v1";
  model;
  constructor() {
    this.apiKey = envVars.RAG.OPENROUTER_API_KEY;
    this.model = envVars.RAG.OPENROUTER_LLM_MODEL;
    if (!this.apiKey) {
      throw new Error("OpenRouter api key is missing...");
    }
  }
  async generateResponse(prompt, context = [], asJson = false) {
    try {
      let fullPrompt = context.length > 0 ? `Context information:
${context.join("\n\n")}

Question: ${prompt}

Answer based on the context above.` : prompt;
      if (asJson) {
        fullPrompt += `

Return ONLY a valid JSON object matching this structure: {"meal": [{"title": "meal title", "description": "meal description", "id": "id"}]}. Do not include any markdown formatting like \`\`\`json.`;
      }
      const systemMessage = asJson ? "You are a helpful assistant for a healthcare management system. Answer questions based on the provided context. You MUST respond with ONLY valid JSON format. Do not include markdown tags." : "You are a helpful assistant for a healthcare management system. Answer questions based on the provided context. If the context does not contain the answer, say you don't have enough information.";
      const bodyPayload = {
        model: this.model,
        messages: [
          {
            role: "system",
            content: systemMessage
          },
          {
            role: "user",
            content: fullPrompt
          }
        ],
        temperature: 0.1,
        // Lower temperature for more deterministic JSON
        max_tokens: 1500
      };
      if (asJson && (this.model.includes("gpt") || this.model.includes("openai"))) {
        bodyPayload.response_format = { type: "json_object" };
      }
      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://lumen-management.local",
          "X-Title": "lumen Management System"
        },
        body: JSON.stringify(bodyPayload)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `OpenRouter API error: ${response.status} - ${errorData.error?.message} || "unknown error"`
        );
      }
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error generating LLM response:", error);
      throw error;
    }
  }
};

// src/app/modules/rag/rag.service.ts
var RAGService = class {
  llmService;
  indexingService;
  embeddingService;
  constructor() {
    this.llmService = new LLMService();
    this.indexingService = new IndexingService();
    this.embeddingService = new EmbeddingService();
  }
  async ingestMealsData() {
    return this.indexingService.indexMealsData();
  }
  async retieveRelevantDocuments(query, limit = 5, sourceType) {
    try {
      const queryEmbedding = await this.embeddingService.generateEmbedding(query);
      const vectorLiteral = `[${queryEmbedding.join(",")}]`;
      const results = await prisma.$queryRaw(prismaNamespace_exports.sql`
          SELECT id, "chunkKey", "sourceType", "sourceId", "sourceLabel", content, metadata, embedding, "isDeleted", "deletedAt", "createdAt", "updatedAt", 1 - (embedding <=> CAST(${vectorLiteral} AS vector)) as similarity
          FROM "document_embeddings"
          WHERE "isDeleted" = false
          ${sourceType ? prismaNamespace_exports.sql`AND "sourceType" = ${sourceType}` : prismaNamespace_exports.empty}
          ORDER BY embedding <=> CAST(${vectorLiteral} AS vector)
          Limit ${limit}
          `);
      return results;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async generateAnswer(query, limit = 5, sourceType, asJson = false) {
    try {
      const relevantDocs = await this.retieveRelevantDocuments(
        query,
        limit,
        sourceType
      );
      const context = relevantDocs.filter((doc) => doc.content).map((doc) => doc.content);
      let answer = await this.llmService.generateResponse(
        query,
        context,
        asJson
      );
      let parsedAnswer = answer;
      if (asJson) {
        try {
          if (answer.startsWith("```json")) {
            answer = answer.replace(/```json\n?/, "").replace(/```$/, "").trim();
          } else if (answer.startsWith("```")) {
            answer = answer.replace(/```\n?/, "").replace(/```$/, "").trim();
          }
          parsedAnswer = JSON.parse(answer);
        } catch (e) {
          console.error("Failed to parse LLM JSON response:", e);
          throw e;
        }
      }
      return {
        answer: parsedAnswer,
        sources: relevantDocs.map((doc) => ({
          id: doc.id,
          chunkKey: doc.chunkKey,
          sourceType: doc.sourceType,
          sourceId: doc.sourceId,
          sourceLabel: doc.sourceLabel,
          content: doc.content,
          similarity: doc.similarity
        })),
        contextUsed: context.length > 0
      };
    } catch (error) {
      console.log(error);
    }
  }
  async getStats() {
    try {
      const totalDocuments = await prisma.$queryRaw(prismaNamespace_exports.sql`
        SELECT COUNT(*) as count FROM "document_embeddings" WHERE "isDeleted" = false;
        `);
      const sourceTypeCounts = await prisma.$queryRaw(prismaNamespace_exports.sql`
        SELECT "sourceType", COUNT(*) as count FROM "document_embeddings" WHERE "isDeleted" = false GROUP BY "sourceType"
        `);
      return {
        totalActiveDocuments: Number(totalDocuments[0]?.count ?? 0),
        sourceTypeBreakdown: sourceTypeCounts.reduce(
          (acc, curr) => {
            acc[curr.sourceType] = Number(curr.count);
            return acc;
          },
          {}
        ),
        timestamp: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};

// src/app/modules/rag/rag.controller.ts
import status22 from "http-status";

// src/app/lib/redis.ts
import { Redis } from "@upstash/redis";
var RedisService = class {
  client = null;
  isConnected = false;
  async connect() {
    try {
      this.client = new Redis({
        url: envVars.UPSTASH_REDIS_REST_URL,
        token: envVars.UPSTASH_REDIS_REST_TOKEN
      });
      this.isConnected = true;
      console.log("Redis Client Ready (Upstash)");
    } catch (error) {
      console.error("Error connecting to Redis:", error);
      this.isConnected = false;
    }
  }
  ensureConnection() {
    if (!this.client) {
      throw new Error("Redis client not initialized. call connect() first.");
    }
    if (!this.isConnected) {
      throw new Error("Redis client not connected");
    }
    return this.client;
  }
  async get(key) {
    try {
      const client = this.ensureConnection();
      return await client.get(key);
    } catch (error) {
      console.error("Redis get error:", error);
      return null;
    }
  }
  async set(key, value, ttlInSecond) {
    try {
      const client = this.ensureConnection();
      const stringValue = typeof value === "string" ? value : JSON.stringify(value);
      await client.set(key, stringValue, {
        ex: ttlInSecond
      });
    } catch (err) {
      console.error("Redis SET error:", err);
    }
  }
  async update(key, value, ttlInSeconds) {
    await this.set(key, value, ttlInSeconds);
  }
  async delete(key) {
    try {
      const client = this.ensureConnection();
      await client.del(key);
    } catch (error) {
      console.log("Redis DELETE ERROR:", error);
    }
  }
  async isAvailable() {
    try {
      const client = this.ensureConnection();
      const res = await client.ping();
      return res === "PONG";
    } catch (error) {
      console.error("Redis ping error:", error);
      return false;
    }
  }
  async disconnect() {
    this.client = null;
    this.isConnected = false;
    console.log("Redis Client Disconnected (virtual)");
  }
};
var redisService = new RedisService();

// src/app/modules/rag/rag.controller.ts
var ragService = new RAGService();
var getStats = catchAsync(async (req, res) => {
  const result = await ragService.getStats();
  sendResponse(res, {
    success: true,
    httpStatusCode: status22.OK,
    message: "RAG stats retrieved successfully",
    data: result
  });
});
var IngestMeals = catchAsync(async (req, res) => {
  const result = await ragService.ingestMealsData();
  console.log(result, "reselt");
  sendResponse(res, {
    success: true,
    message: "ingest meals successfully",
    httpStatusCode: 200,
    data: result
  });
});
var queryRag = catchAsync(async (req, res) => {
  const { query, limit, sourceType } = req.body;
  if (!query) {
    return sendResponse(res, {
      success: false,
      httpStatusCode: status22.BAD_REQUEST,
      message: "Query is required"
    });
  }
  const cacheKey = `rag:query:${query}:${limit ?? 5}:${sourceType || "all"}`;
  console.log(cacheKey, "es");
  try {
    const cacheResult = await redisService.get(cacheKey);
    if (cacheResult) {
      return sendResponse(res, {
        success: true,
        httpStatusCode: status22.OK,
        message: "Answer retrieved from cache",
        data: cacheResult
      });
    }
  } catch (error) {
    console.warn("Cache read error , proceeding with normal processing ", error);
  }
  const result = await ragService.generateAnswer(
    query,
    limit ?? 5,
    sourceType,
    true
  );
  console.log(result, "result");
  try {
    const dat = await redisService.set(cacheKey, result, 600);
    console.log(dat, "da");
  } catch (error) {
    console.log("cache Write error", error);
  }
  sendResponse(res, {
    success: true,
    httpStatusCode: status22.OK,
    message: "Answer generated successfully",
    data: result
  });
});
var RagController = { getStats, IngestMeals, queryRag };

// src/app/modules/rag/rag.route.ts
var router10 = Router9();
router10.get("/stats", RagController.getStats);
router10.post("/ingest-meals", RagController.IngestMeals);
router10.post("/query", RagController.queryRag);
var Ragrouter = router10;

// src/app/modules/blog/blog.route.ts
import { Router as Router10 } from "express";

// src/app/modules/blog/blog.validation.ts
import { z as z8 } from "zod";
var createBlogSchema = z8.object({
  title: z8.string().min(1, { message: "Title is required." }),
  content: z8.string().min(1, { message: "Content is required." }),
  images: z8.array(z8.string()).default([]),
  mealid: z8.string()
});
var updateBlogSchema = z8.object({
  title: z8.string().min(1, { message: "Title cannot be empty." }).optional(),
  content: z8.string().min(1, { message: "Content cannot be empty." }).optional(),
  images: z8.array(z8.string()).default([]),
  authorId: z8.string().min(1, { message: "Author ID cannot be empty." }).optional(),
  mealid: z8.string().optional().nullable()
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided to update the blog." }
);

// src/app/modules/blog/blog.controller.ts
import status24 from "http-status";

// src/app/modules/blog/blog.service.ts
import status23 from "http-status";
var createBlog = async (user, payload) => {
  const { title, content, images, mealid } = payload;
  const existingUser = await prisma.user.findUnique({
    where: { email: user.email }
  });
  if (!existingUser) {
    throw new AppError_default(status23.NOT_FOUND, "User not found.");
  }
  if (!images || !Array.isArray(images) || images.length === 0) {
    throw new AppError_default(status23.BAD_REQUEST, "At least one image is required to create a blog.");
  }
  if (!mealid) {
    throw new AppError_default(status23.BAD_REQUEST, "mealid ID is required to create a blog.");
  }
  const meal = await prisma.meal.findUnique({
    where: { id: mealid }
  });
  if (!meal) {
    throw new AppError_default(status23.BAD_REQUEST, "The provided mealid does not correspond to any existing mealid.");
  }
  if (!title || !content || !images) {
    throw new AppError_default(status23.BAD_REQUEST, "Title, content, and image are required to create a blog.");
  }
  const blog = await prisma.blog.create({
    data: {
      title,
      content,
      images,
      authorId: existingUser.id,
      mealid: meal.id
    }
  });
  return blog;
};
var getAllBlogs = async (query, page, limit, skip, sortBy, sortOrder, search) => {
  const andConditions = [];
  if (query) {
    const orConditions = [];
    if (query.title) {
      orConditions.push({
        title: {
          contains: query.title,
          mode: "insensitive"
        }
      });
    }
    if (query.createdAt) {
      const dateRange = parseDateForPrisma(query.createdAt);
      andConditions.push({ createdAt: dateRange.gte });
    }
    if (search) {
      const orConditions2 = [];
      orConditions2.push(
        {
          title: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          content: {
            contains: search,
            mode: "insensitive"
          }
        }
      );
      andConditions.push({ OR: orConditions2 });
    }
  }
  console.log(andConditions, "sdfasf");
  const blogs = await prisma.blog.findMany({
    where: { AND: andConditions },
    skip: skip || (page && limit ? (page - 1) * limit : void 0),
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      author: { select: { id: true, name: true, email: true, image: true } },
      meal: true
    }
  });
  const total = await prisma.blog.count({ where: { AND: andConditions } });
  return {
    data: blogs,
    pagination: {
      total,
      page: page || 1,
      limit: 9,
      totalpage: limit ? Math.ceil(total / limit) : 1
    }
  };
};
var getSingleBlog = async (blogId) => {
  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
    include: {
      author: { select: { id: true, name: true, email: true, image: true } },
      meal: true
    }
  });
  if (!blog) {
    throw new AppError_default(404, "Blog not found");
  }
  return blog;
};
var updateBlog = async (blogId, payload, user) => {
  const userFromDb = await prisma.user.findUnique({
    where: { email: user.email }
  });
  if (!userFromDb) {
    throw new AppError_default(404, "User not found");
  }
  const blog = await prisma.blog.findUnique({
    where: { id: blogId }
  });
  if (!blog) {
    throw new AppError_default(404, "Blog not found");
  }
  if (userFromDb.role !== "Admin" && blog.authorId !== user.id) {
    throw new AppError_default(403, "You are not authorized to update this blog");
  }
  const updatedBlog = await prisma.blog.update({
    where: { id: blogId },
    data: {
      content: payload.content,
      images: payload.images,
      title: payload.title
    }
  });
  return updatedBlog;
};
var deleteBlog = async (user, blogId) => {
  const userFromDb = await prisma.user.findUnique({
    where: { email: user.email }
  });
  if (!userFromDb) {
    throw new AppError_default(404, "User not found");
  }
  const blog = await prisma.blog.findUnique({
    where: { id: blogId }
  });
  if (!blog) {
    throw new AppError_default(404, "Blog not found");
  }
  if (userFromDb.role !== "Admin" && blog.authorId !== userFromDb.id) {
    throw new AppError_default(403, "You are not authorized to delete this blog");
  }
  const deletedBlog = await prisma.blog.delete({
    where: { id: blogId }
  });
  return deletedBlog;
};
var getBlogsByAuthor = async (authorId, page, limit, skip, sortBy = "createdAt", sortOrder = "desc") => {
  const where = { authorId };
  const blogs = await prisma.blog.findMany({
    where,
    skip: skip || (page && limit ? (page - 1) * limit : void 0),
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      author: { select: { id: true, name: true, email: true, image: true } }
    }
  });
  const total = await prisma.blog.count({ where });
  return {
    data: blogs,
    pagination: {
      total,
      page: page || 1,
      limit: limit || blogs.length,
      totalpage: limit ? Math.ceil(total / limit) : 1
    }
  };
};
var BlogServices = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  getBlogsByAuthor
};

// src/app/modules/blog/blog.controller.ts
var createBlog2 = catchAsync(async (req, res) => {
  if (!req.user?.email) {
    throw new AppError_default(status24.UNAUTHORIZED, "Unauthorized access. Please login first.");
  }
  const files = req.files;
  const payload = {
    ...req.body,
    images: files?.length ? files.map((file) => file.path) : req.body.images
  };
  const user = req.user;
  const result = await BlogServices.createBlog(user, payload);
  sendResponse(res, {
    httpStatusCode: status24.CREATED,
    success: true,
    message: "Blog created successfully",
    data: result
  });
});
var getAllBlogs2 = catchAsync(async (req, res) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
  const { search } = req.query;
  const result = await BlogServices.getAllBlogs(req.query, page, limit, skip, sortBy, sortOrder, search);
  sendResponse(res, {
    httpStatusCode: status24.OK,
    success: true,
    message: "Blogs fetched successfully",
    data: result
  });
});
var getSingleBlog2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BlogServices.getSingleBlog(id);
  sendResponse(res, {
    httpStatusCode: status24.OK,
    success: true,
    message: "Blog fetched successfully",
    data: result
  });
});
var updateBlog2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BlogServices.updateBlog(id, req.body, req.user);
  sendResponse(res, {
    httpStatusCode: status24.OK,
    success: true,
    message: "Blog updated successfully",
    data: result
  });
});
var deleteBlog2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BlogServices.deleteBlog(req.user, id);
  sendResponse(res, {
    httpStatusCode: status24.OK,
    success: true,
    message: "Blog deleted successfully",
    data: result
  });
});
var BlogController = {
  createBlog: createBlog2,
  getAllBlogs: getAllBlogs2,
  getSingleBlog: getSingleBlog2,
  updateBlog: updateBlog2,
  deleteBlog: deleteBlog2
};

// src/app/modules/blog/blog.route.ts
var router11 = Router10();
router11.post(
  "/blog",
  auth_default([UserRoles.Admin]),
  multerUpload.array("files"),
  validateRequest(createBlogSchema),
  BlogController.createBlog
);
router11.get(
  "/blogs",
  BlogController.getAllBlogs
);
router11.get(
  "/blog/:id",
  BlogController.getSingleBlog
);
router11.put(
  "/blog/:id",
  auth_default([UserRoles.Admin]),
  validateRequest(updateBlogSchema),
  BlogController.updateBlog
);
router11.delete(
  "/blog/:id",
  auth_default([UserRoles.Admin]),
  BlogController.deleteBlog
);
var BlogRouters = router11;

// src/app/modules/highlight/highlight.route.ts
import { Router as Router11 } from "express";

// src/app/modules/highlight/highlight.validation.ts
import { z as z9 } from "zod";
var createHighlightSchema = z9.object({
  title: z9.string().min(1, { message: "Title is required." }),
  description: z9.string().min(1, { message: "Description is required." }),
  image: z9.string().url({ message: "Image must be a valid URL." }).optional().nullable()
});
var updateHighlightSchema = z9.object({
  title: z9.string().optional(),
  description: z9.string().optional(),
  image: z9.any().optional()
});

// src/app/modules/highlight/highlight.controller.ts
import status26 from "http-status";

// src/app/modules/highlight/highlight.service.ts
import status25 from "http-status";
var createHighlight = async (user, payload) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: user.email }
  });
  if (!existingUser) {
    throw new AppError_default(status25.NOT_FOUND, "User not found.");
  }
  const { title, description, image } = payload;
  if (!title || !description) {
    throw new AppError_default(status25.BAD_REQUEST, "Title and description are required to create a highlight.");
  }
  const highlight = await prisma.highlight.create({
    data: {
      title,
      description,
      image: image ?? null,
      userId: existingUser.id
    }
  });
  return highlight;
};
var getAllHighlights = async (query, page, limit, skip, sortBy = "createdAt", sortOrder = "desc", search) => {
  const where = {};
  if (query?.title) {
    where.title = { contains: query.title, mode: "insensitive" };
  }
  if (query?.description) {
    where.description = { contains: query.description, mode: "insensitive" };
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } }
    ];
  }
  const highlights = await prisma.highlight.findMany({
    where,
    skip: skip || (page && limit ? (page - 1) * limit : void 0),
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } }
    }
  });
  const total = await prisma.highlight.count({ where });
  return {
    data: highlights,
    pagination: {
      total,
      page: page || 1,
      limit: limit || highlights.length,
      totalpage: limit ? Math.ceil(total / limit) : 1
    }
  };
};
var getSingleHighlight = async (highlightId) => {
  const highlight = await prisma.highlight.findUnique({
    where: { id: highlightId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } }
    }
  });
  if (!highlight) {
    throw new AppError_default(status25.NOT_FOUND, "Highlight not found");
  }
  return highlight;
};
var updateHighlight = async (highlightId, payload, user) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: user.email }
  });
  if (!existingUser) {
    throw new AppError_default(status25.NOT_FOUND, "User not found.");
  }
  const highlight = await prisma.highlight.findUnique({
    where: { id: highlightId }
  });
  if (!highlight) {
    throw new AppError_default(status25.NOT_FOUND, "Highlight not found");
  }
  if (existingUser.role !== "Admin" && highlight.userId !== existingUser.id) {
    throw new AppError_default(status25.FORBIDDEN, "You are not authorized to update this highlight");
  }
  const updatedHighlight = await prisma.highlight.update({
    where: { id: highlightId },
    data: payload
  });
  return updatedHighlight;
};
var deleteHighlight = async (user, highlightId) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: user.email }
  });
  if (!existingUser) {
    throw new AppError_default(status25.NOT_FOUND, "User not found.");
  }
  const highlight = await prisma.highlight.findUnique({
    where: { id: highlightId }
  });
  if (!highlight) {
    throw new AppError_default(status25.NOT_FOUND, "Highlight not found");
  }
  if (existingUser.role !== "Admin" && highlight.userId !== existingUser.id) {
    throw new AppError_default(status25.FORBIDDEN, "You are not authorized to delete this highlight");
  }
  const deletedHighlight = await prisma.highlight.delete({
    where: { id: highlightId }
  });
  return deletedHighlight;
};
var HighlightServices = {
  createHighlight,
  getAllHighlights,
  getSingleHighlight,
  updateHighlight,
  deleteHighlight
};

// src/app/modules/highlight/highlight.controller.ts
var createHighlight2 = catchAsync(async (req, res) => {
  if (!req.user?.email) {
    throw new AppError_default(status26.UNAUTHORIZED, "Unauthorized access. Please login first.");
  }
  const payload = {
    ...req.body,
    image: req.file?.path || req.body.image
  };
  const user = req.user;
  const result = await HighlightServices.createHighlight(user, payload);
  sendResponse(res, {
    httpStatusCode: status26.CREATED,
    success: true,
    message: "Highlight created successfully",
    data: result
  });
});
var getAllHighlights2 = catchAsync(async (req, res) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
  const result = await HighlightServices.getAllHighlights({
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    filters: req.query
  });
  sendResponse(res, {
    httpStatusCode: status26.OK,
    success: true,
    message: "Highlights fetched successfully",
    data: result
  });
});
var getSingleHighlight2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await HighlightServices.getSingleHighlight(id);
  sendResponse(res, {
    httpStatusCode: status26.OK,
    success: true,
    message: "Highlight fetched successfully",
    data: result
  });
});
var updateHighlight2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = {
    ...req.body.title !== void 0 && { title: req.body.title },
    ...req.body.description !== void 0 && { description: req.body.description },
    ...req.body.image !== void 0 && { image: req.body.image }
  };
  const result = await HighlightServices.updateHighlight(id, payload, req.user);
  sendResponse(res, {
    httpStatusCode: status26.OK,
    success: true,
    message: "Highlight updated successfully",
    data: result
  });
});
var deleteHighlight2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await HighlightServices.deleteHighlight(req.user, id);
  sendResponse(res, {
    httpStatusCode: status26.OK,
    success: true,
    message: "Highlight deleted successfully",
    data: result
  });
});
var HighlightController = {
  createHighlight: createHighlight2,
  getAllHighlights: getAllHighlights2,
  getSingleHighlight: getSingleHighlight2,
  updateHighlight: updateHighlight2,
  deleteHighlight: deleteHighlight2
};

// src/app/modules/highlight/highlight.route.ts
var router12 = Router11();
router12.post(
  "/highlight",
  auth_default([UserRoles.Admin]),
  multerUpload.single("file"),
  validateRequest(createHighlightSchema),
  HighlightController.createHighlight
);
router12.get(
  "/highlights",
  HighlightController.getAllHighlights
);
router12.get(
  "/highlight/:id",
  HighlightController.getSingleHighlight
);
router12.put(
  "/highlight/:id",
  auth_default([UserRoles.Admin]),
  validateRequest(updateHighlightSchema),
  HighlightController.updateHighlight
);
router12.delete(
  "/highlight/:id",
  auth_default([UserRoles.Admin]),
  HighlightController.deleteHighlight
);
var HighlightRouters = router12;

// src/app/modules/newsletter/newsletter.route.ts
import { Router as Router12 } from "express";

// src/app/modules/newsletter/newsletter.validation.ts
import { z as z10 } from "zod";
var createNewsletterSchema = z10.object({
  email: z10.string()
});
var updateNewsletterSchema = z10.object({
  email: z10.string().optional()
});

// src/app/modules/newsletter/newsletter.controller.ts
import status28 from "http-status";

// src/app/modules/newsletter/newsletter.service.ts
import status27 from "http-status";
var createNewsletter = async (payload) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.user.email }
  });
  if (!existingUser) {
    throw new AppError_default(status27.NOT_FOUND, "User not found.");
  }
  if (!payload.email) {
    throw new AppError_default(status27.BAD_REQUEST, "Email and userId are required to subscribe to the newsletter.");
  }
  const existing = await prisma.newsletter.findUnique({
    where: { email: payload.email }
  });
  if (existing) {
    throw new AppError_default(status27.CONFLICT, "This email is already subscribed to the newsletter.");
  }
  const newsletter = await prisma.newsletter.create({
    data: {
      email: payload.email,
      userId: existingUser.id
    }
  });
  return newsletter;
};
var getAllNewsletters = async (query, page, limit, skip) => {
  const andConditions = [];
  if (query?.email) {
    andConditions.push({
      email: {
        contains: query.email,
        mode: "insensitive"
      }
    });
  }
  if (query?.createdAt) {
    const dateRange = parseDateForPrisma(query.createdAt);
    andConditions.push({ createdAt: dateRange.gte });
  }
  const newsletters = await prisma.newsletter.findMany({
    skip: skip || (page && limit ? (page - 1) * limit : void 0),
    take: limit,
    where: { AND: andConditions },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true }
      }
    }
  });
  const total = await prisma.newsletter.count({ where: { AND: andConditions } });
  return {
    data: newsletters,
    pagination: {
      total,
      page: page || 1,
      limit: 9,
      totalpage: limit ? Math.ceil(total / limit) : 1
    }
  };
};
var getSingleNewsletter = async (newsletterId) => {
  const newsletter = await prisma.newsletter.findUnique({
    where: { id: newsletterId },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true }
      }
    }
  });
  if (!newsletter) {
    throw new AppError_default(status27.NOT_FOUND, "Newsletter subscription not found");
  }
  return newsletter;
};
var updateNewsletter = async (newsletterId, payload) => {
  const newsletter = await prisma.newsletter.findUnique({
    where: { id: newsletterId }
  });
  if (!newsletter) {
    throw new AppError_default(status27.NOT_FOUND, "Newsletter subscription not found");
  }
  if (payload.email && payload.email !== newsletter.email) {
    const existing = await prisma.newsletter.findUnique({
      where: { email: payload.email }
    });
    if (existing) {
      throw new AppError_default(status27.CONFLICT, "This email is already subscribed to the newsletter.");
    }
  }
  const updatedNewsletter = await prisma.newsletter.update({
    where: { id: newsletterId },
    data: payload
  });
  return updatedNewsletter;
};
var deleteNewsletter = async (newsletterId) => {
  const newsletter = await prisma.newsletter.findUnique({
    where: { id: newsletterId }
  });
  if (!newsletter) {
    throw new AppError_default(status27.NOT_FOUND, "Newsletter subscription not found");
  }
  const deletedNewsletter = await prisma.newsletter.delete({
    where: { id: newsletterId }
  });
  return deletedNewsletter;
};
var NewsletterService = {
  createNewsletter,
  getAllNewsletters,
  getSingleNewsletter,
  updateNewsletter,
  deleteNewsletter
};

// src/app/modules/newsletter/newsletter.controller.ts
var createNewsletter2 = catchAsync(async (req, res) => {
  if (!req.user?.email) {
    throw new AppError_default(status28.UNAUTHORIZED, "Unauthorized access. Please login first.");
  }
  const { email } = req.body;
  console.log(email, "email");
  const result = await NewsletterService.createNewsletter({ email, user: req.user });
  sendResponse(res, {
    httpStatusCode: status28.CREATED,
    success: true,
    message: "Newsletter subscription created successfully",
    data: result
  });
});
var getAllNewsletters2 = catchAsync(async (req, res) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
  const result = await NewsletterService.getAllNewsletters(req.query, page, limit, skip);
  sendResponse(res, {
    httpStatusCode: status28.OK,
    success: true,
    message: "Newsletters fetched successfully",
    data: result
  });
});
var getSingleNewsletter2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await NewsletterService.getSingleNewsletter(id);
  sendResponse(res, {
    httpStatusCode: status28.OK,
    success: true,
    message: "Newsletter fetched successfully",
    data: result
  });
});
var updateNewsletter2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = {
    ...req.body.email !== void 0 && { email: req.body.email }
  };
  const result = await NewsletterService.updateNewsletter(id, payload);
  sendResponse(res, {
    httpStatusCode: status28.OK,
    success: true,
    message: "Newsletter updated successfully",
    data: result
  });
});
var deleteNewsletter2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await NewsletterService.deleteNewsletter(id);
  sendResponse(res, {
    httpStatusCode: status28.OK,
    success: true,
    message: "Newsletter deleted successfully",
    data: result
  });
});
var NewsletterController = {
  createNewsletter: createNewsletter2,
  getAllNewsletters: getAllNewsletters2,
  getSingleNewsletter: getSingleNewsletter2,
  updateNewsletter: updateNewsletter2,
  deleteNewsletter: deleteNewsletter2
};

// src/app/modules/newsletter/newsletter.route.ts
var router13 = Router12();
router13.post(
  "/newsletter",
  auth_default([UserRoles.Admin, UserRoles.Customer, UserRoles.Provider]),
  validateRequest(createNewsletterSchema),
  NewsletterController.createNewsletter
);
router13.get(
  "/newsletters",
  auth_default([UserRoles.Admin]),
  NewsletterController.getAllNewsletters
);
router13.get(
  "/newsletter/:id",
  NewsletterController.getSingleNewsletter
);
router13.put(
  "/newsletter/:id",
  auth_default([UserRoles.Admin]),
  validateRequest(updateNewsletterSchema),
  NewsletterController.updateNewsletter
);
router13.delete(
  "/newsletter/:id",
  auth_default([UserRoles.Admin]),
  NewsletterController.deleteNewsletter
);
var NewsletterRouters = router13;

// src/app/routes/index.route.ts
var router14 = Router13();
router14.use("/v1", mealRouter.router);
router14.use("/v1/rag", Ragrouter);
router14.use("/v1", NewsletterRouters);
router14.use("/v1", BlogRouters);
router14.use("/v1", HighlightRouters);
router14.use("/v1", providerRouter.router);
router14.use("/v1", OrderRouter.router);
router14.use("/v1", CategoryRouter.router);
router14.use("/v1", UserRouter.router);
router14.use("/v1", ReviewsRouter.router);
router14.use("/v1", StatsRoutes);
router14.use("/v1", PaymentRouter);
router14.use("/v1/auth", authRouter.router);
var IndexRouter = router14;

// src/app.ts
var app = express2();
app.post("/webhook", express2.raw({ type: "application/json" }), PaymentController.handleStripeWebhookEvent);
app.use(express2.json());
app.use(cookieParser());
app.use(express2.urlencoded({ extended: true }));
app.use(cors({
  origin: envVars.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use("/api", IndexRouter);
app.use(globalErrorHandeller_default);
app.use(Notfound);
var app_default = app;

// src/server.ts
var port = envVars.PORT || 4e3;
var main = async () => {
  try {
    await prisma.$connect();
    await redisService.connect().catch(console.error);
    console.log("connected to database successfully");
    app_default.listen(port, () => {
      console.log(`Example app listening on port http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message || error);
    if (error?.stack) console.error(error.stack);
    await prisma.$disconnect();
    process.exit(1);
  }
};
main();
