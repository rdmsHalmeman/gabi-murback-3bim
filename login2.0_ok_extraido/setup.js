#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🥛 MILKMOO - Setup do Sistema');
console.log('============================\n');

// Verificar se o Node.js está instalado
console.log('1. Verificando Node.js...');
const nodeVersion = process.version;
console.log(`   ✅ Node.js ${nodeVersion} detectado\n`);

// Verificar se o PostgreSQL está instalado
console.log('2. Verificando PostgreSQL...');
exec('psql --version', (error, stdout, stderr) => {
  if (error) {
    console.log('   ❌ PostgreSQL não encontrado');
    console.log('   📝 Instale o PostgreSQL: https://www.postgresql.org/download/');
    return;
  }
  
  console.log(`   ✅ PostgreSQL detectado: ${stdout.trim()}\n`);
  
  // Verificar se o banco existe
  console.log('3. Verificando banco de dados...');
  exec('psql -U postgres -d milkmoo -c "SELECT 1;"', (error, stdout, stderr) => {
    if (error) {
      console.log('   ❌ Banco "milkmoo" não encontrado');
      console.log('   📝 Execute os seguintes comandos:');
      console.log('      createdb -U postgres milkmoo');
      console.log('      psql -U postgres -d milkmoo -f documentacao/milkMooCreate.sql');
      console.log('      psql -U postgres -d milkmoo -f documentacao/milkMooInserts.sql\n');
    } else {
      console.log('   ✅ Banco "milkmoo" encontrado\n');
    }
    
    // Verificar dependências
    console.log('4. Verificando dependências...');
    const packageJsonPath = path.join(__dirname, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      console.log('   ✅ package.json encontrado');
      
      // Verificar node_modules
      const nodeModulesPath = path.join(__dirname, 'node_modules');
      if (fs.existsSync(nodeModulesPath)) {
        console.log('   ✅ node_modules encontrado\n');
      } else {
        console.log('   ❌ node_modules não encontrado');
        console.log('   📝 Execute: npm install\n');
      }
    } else {
      console.log('   ❌ package.json não encontrado\n');
    }
    
    // Instruções finais
    console.log('🚀 Para iniciar o sistema:');
    console.log('   1. Certifique-se de que o PostgreSQL está rodando');
    console.log('   2. Execute: node backend/server.js');
    console.log('   3. Acesse: http://localhost:3001');
    console.log('\n👥 Usuários de teste:');
    console.log('   Cliente: cliente@teste.com / 123456');
    console.log('   Gerente: gerente@teste.com / 123456');
    console.log('\n📚 Consulte o README_MILKMOO.md para mais informações');
  });
});
