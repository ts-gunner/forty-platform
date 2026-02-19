export default [
    {
      requestLibPath: "import request from '@/utils/admin_request'",
      schemaPath: 'http://127.0.0.1:18888/ft/swagger/doc.json',
      // schemaPath: 'http://127.0.0.1:18888/steins/go/swagger/doc.json',  // go swagger文档
      serversPath: "./src/services",
      projectName: 'steins-admin',
    },
  ]