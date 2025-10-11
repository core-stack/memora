# 🤝 Contribuindo com o Snipet

Obrigado por considerar contribuir para este projeto! Este guia ajudará você a entender como contribuir de forma eficaz e causar o máximo impacto.

## 🎯 Como Contribuir

### 🐛 Relatando Bugs

Se você encontrou um bug no Snipet:

1. **Verifique se já existe uma issue** sobre o problema
2. **Crie uma nova issue** com:
- Descrição clara do bug
- Etapas para reproduzir
- Comportamento esperado vs. real
- Capturas de tela (se aplicável)

### ✨ Sugerindo Melhorias

Para sugerir novos recursos ou melhorias:

1. **Descreva claramente** a funcionalidade desejada
2. **Explique o problema** que ele resolve
3. **Forneça exemplos** de como deve funcionar
4. **Considere implementá-lo** você mesmo, se possível

### 📝 Melhorando a Documentação

Documentação é sempre bem-vinda! Você pode ajudar com:

- Corrigir erros de digitação e gramática
- Melhorar as explicações e a clareza
- Adicionar exemplos e casos de uso
- Traduzir para outros idiomas

## 🛠️ Processo de Contribuição

### 1. Bifurcar o Repositório

```bash
# Clonar seu fork
git clone https://github.com/core-stack/snipet.git
cd snipet

# Adicionar o repositório original como upstream
git remote add upstream https://github.com/core-stack/snipet.git
```

### 2. Criar uma Ramificação

```bash
# Criar uma ramificação para sua contribuição
git checkout -b feature/nome-da-sua-contribuição
```

### 3. Fazer suas Alterações

- **Manter a consistência** com o estilo existente
- **Teste suas alterações** antes de enviar
- **Documentar** novos recursos
- **Atualizar CHANGELOG.md** se necessário

### 4. Commit e Push

```bash
# Adicione suas alterações
git add .

# Commit com mensagem descritiva
git commit -m "feat: adicionar novo recurso para Snipet"

# Envie para sua branch
git push origin feature/nome-da-sua-contribuição
```

### 5. Abra o Pull Request

1. **Acesse seu fork** no GitHub
2. **Clique em "Novo Pull Request"**
3. **Preencha o modelo** fornecido
4. **Aguarde a revisão**

## 📋 Padrões de Código

### Padrões TypeScript / Node.js

- **Siga as configurações ESLint e Prettier** no projeto
- **Escreva comentários claros** para código complexo
- **Use nomes de variáveis ​​significativos**
- **Mantenha as funções pequenas, puras e modulares**

### Mensagens de Commit

Use o padrão [Conventional Commits](https://conventionalcommits.org/):

```
feat: add new [FEATURE_TYPE] functionality
fix: resolve [ISSUE_TYPE] in [COMPONENT]
docs: update [DOCUMENTATION_SECTION]
style: improve [STYLING_ELEMENT] formatting
```

### Convenções de Nomenclatura

- **Arquivos**: `user-auth.ts`, `vector-search.service.ts`
- **Ramos**: `feature/description`, `fix/description`, `docs/description`
- **Variáveis**: `camelCase` para JS/TS, `PascalCase` para classes

## 🧪 Testando suas alterações

Antes de enviar, teste suas alterações:

1. **Execute os testes existentes**: `pnpm test`
2. **Adicione novos testes** para novos recursos ou correções de bugs
3. **Verifique se a compilação funciona**: `pnpm build`
4. **Verifique a formatação**: `pnpm lint`
5. **Garantir a funcionalidade** em ambientes suportados (Node 22+, aplicativo web)

## 📝 Tipos de Contribuições

### 🆕 Novos Recursos

- Melhorias na gestão do conhecimento
- Melhorias na memória de IA
- Extensões do SDK do plugin
- Otimizações de desempenho

### 🔧 Correções de bugs

- Sincronização do índice de pesquisa
- Problemas de carregamento do plugin
- Erros de recuperação de memória
- Vulnerabilidades de segurança

### 📚 Documentação

- Guias de uso e exemplos
- Atualizações de referência da API
- Instruções de configuração para desenvolvedores
- Traduções e localização

### 🎨 Design

- Melhorias na UI/UX
- Melhorias na acessibilidade
- Consistência visual
- Design responsivo

## 🎯 Roteiro

### Recursos futuros

- [ ] Suporte a workspace multilocatário
- [ ] Integração com o marketplace de plugins
- [ ] Modo de sincronização offline/local-first
- [ ] Busca semântica inteligente

### Prioridade Contribuições

1. **Melhorar a estabilidade do plugin SDK**
2. **Melhorar o desempenho da memória da IA**
3. **Adicionar mais documentação para desenvolvedores**
4. **Refinar a experiência de configuração de auto-hospedagem**

## ❓ Dúvidas?

Se tiver dúvidas sobre como contribuir:

1. **Abrir um issue** com a tag `question`
2. **Verificar issues existentes** para perguntas semelhantes
3. **Entrar em contato com os mantenedores** através das [Discussões do GitHub](https://github.com/core-stack/snipet/discussions)

## 🏆 Reconhecimento

Os colaboradores serão reconhecidos:

- Na seção de colaboradores do README
- No arquivo CHANGELOG.md
- Nas versões do projeto
- No site do projeto (quando disponível)

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a **Licença Snipet (baseada no Apache 2.0).**.

---

**Obrigado por contribuir com o Snipet! 🎉**

Cada contribuição, por menor que seja, faz a diferença para a comunidade.

## 💡 Dicas Profissionais para Colaboradores

### 🎨 Dicas de Desenvolvimento

1. **Leia a base de código** - entenda módulos como memória, busca e plugins.
2. **Comece pequeno** - Comece com a documentação ou pequenas correções de bugs
3. **Faça perguntas** - Não hesite em pedir esclarecimentos
4. **Teste exaustivamente** - Certifique-se de que suas alterações funcionem conforme o esperado
5. **Siga as convenções** - Mantenha a consistência com o código existente

### 🔧 Dicas Técnicas

1. **Use o ambiente de desenvolvimento** - Configure o desenvolvimento local corretamente
2. **Escreva testes** - Adicione testes para novas funcionalidades
3. **Verifique as dependências** - Certifique-se de que todas as dependências sejam gerenciadas corretamente
4. **Revise o código existente** - Aprenda com as implementações existentes
5. **Documente as alterações** - Explique as alterações complexas com clareza

### 📚 Dicas de Documentação

1. **Escreva descrições claras** - Torne suas contribuições fáceis de entender
2. **Inclua exemplos** - Mostre como usar os novos recursos
3. **Atualize a documentação relacionada** - Mantenha toda a documentação sincronizada
4. **Use formatação consistente** - Siga o estilo de documentação do projeto
5. **Seja abrangente** - Aborde todos os aspectos das suas alterações

---

**Pronto para contribuir?** Comece bifurcando o repositório e criando sua primeira ramificação! 🚀