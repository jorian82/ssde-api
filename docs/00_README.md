# Database connections and access configuration

Managing databases is always a tedious task and maintaining consistency is also imperative, there are several ways to achieve this, other development languages have frameworks, Java has Hibernate and Spring (to name some), Python has Serializer, other Frameworks have their libraries to handle database connections and allow several DB dialects to be used without having to worry about syntax to perform basic CRUD operations.

NodeJS surely has several libraries, as of now we'll be focusing on Sequelizer

##  Sequelizer configuration

Node has a way to do things, all is a module, an object. We'll start with a configuration file, we can store the properties in environmental variables to keep the app secure and avoid publishing DB information to prying eyes.

For demonstration purposes we'll use the data for the configuration