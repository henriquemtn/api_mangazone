const Volume = require("../models/volume");

exports.createVolume = async (req, res) => {
  try {
    const { number, date, alternativeCover, image, linkAmazon, price } =
      req.body;
    const volume = new Volume({
      number,
      date,
      alternativeCover,
      image,
      linkAmazon,
      price,
    });
    await volume.save();
    res.status(201).json(volume);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao criar volume");
  }
};

// Obter todos os volumes
exports.getAllVolumes = async (req, res) => {
  try {
    const volumes = await Volume.find();
    res.json(volumes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao buscar volumes");
  }
};

// Obter um volume por ID
exports.getVolumeById = async (req, res) => {
  try {
    const volume = await Volume.findById(req.params.id);
    if (!volume) {
      return res.status(404).json({ message: "Volume não encontrado" });
    }
    res.json(volume);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao buscar volume");
  }
};

// Atualizar um volume por ID
exports.updateVolume = async (req, res) => {
  try {
    const { number, date, alternativeCover, image, linkAmazon, price } =
      req.body;
    const volume = await Volume.findByIdAndUpdate(
      req.params.id,
      { number, date, alternativeCover, image, linkAmazon, price },
      { new: true }
    );
    if (!volume) {
      return res.status(404).json({ message: "Volume não encontrado" });
    }
    res.json(volume);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao atualizar volume");
  }
};

// Deletar um volume por ID
exports.deleteVolume = async (req, res) => {
  try {
    const volume = await Volume.findByIdAndDelete(req.params.id);
    if (!volume) {
      return res.status(404).json({ message: "Volume não encontrado" });
    }
    res.json({ message: "Volume deletado com sucesso" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao deletar volume");
  }
};
